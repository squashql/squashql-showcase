import {
  comparisonMeasureWithGrandTotal,
  comparisonMeasureWithinSameGroup,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  Field,
  from,
  GroupColumnSet,
  integer,
  Measure,
  multiply,
  PivotConfig,
  Query,
  QueryMerge,
  sum,
  TableField,
  Year
} from "@squashql/squashql-js"
import {spending} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {CompareWithGrandTotalAlongAncestors, PercentOfParentAlongAncestors, toCriteria} from "@/app/lib/queries"

const amount = sum("amount", spending.amount)
const popOfRow = new CompareWithGrandTotalAlongAncestors("amount - % of row", amount, "column")
const popOfParentOnRows = new PercentOfParentAlongAncestors("amount - % of parent of row", amount, "column")
const popOfCol = new CompareWithGrandTotalAlongAncestors("amount - % on column", amount, "row")
const popOfParentOnCols = new PercentOfParentAlongAncestors("amount - % of parent of column", amount, "row")
const popOfGT = multiply("amount - % of grand total", comparisonMeasureWithGrandTotal("amount_percent_gt", ComparisonMethod.DIVIDE, amount), integer(100))

const groupOfCountries = new TableField("group of countries")
const countryGroups = new Map(Object.entries({
  "comp. with fr": ["france", "usa", "uk"],
  "comp. with uk": ["uk", "france", "usa"],
  "comp. with usa": ["usa", "france", "uk"],
}))

function createSpendingMeasures(): Measure[] {
  const yoyGrowth = comparisonMeasureWithPeriod(
          "YoY Growth",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.year, "y-1"]]),
          new Year(spending.year))
  const amountComparison = comparisonMeasureWithinSameGroup("group amount comparison",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.country, "first"]]))
  return [amount, yoyGrowth, amountComparison, popOfCol, popOfRow, popOfGT, popOfParentOnRows, popOfParentOnCols]
}

function createSpendingFields(): Field[] {
  return [spending.spendingCategory, spending.spendingSubcategory, spending.continent, spending.country, spending.city, spending.year, groupOfCountries]
}

const spendingFields = createSpendingFields()
const spendingMeasures = createSpendingMeasures()

export class SpendingQueryProvider implements QueryProvider {

  readonly selectableFields = spendingFields
  readonly measures = spendingMeasures
  readonly table = [spending]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    const gocIndex = select.indexOf(groupOfCountries)
    select = select.filter(f => f !== groupOfCountries)
    const columnSets = gocIndex >= 0 ? [new GroupColumnSet(groupOfCountries, spending.country, countryGroups)] : []

    return from(spending._name)
            .where(toCriteria(filters))
            .select(select, columnSets, values)
            .build()
  }
}
