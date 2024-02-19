import {
  comparisonMeasureWithGrandTotal, comparisonMeasureWithGrandTotalAlongAncestors,
  comparisonMeasureWithinSameGroup,
  comparisonMeasureWithParent,
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

interface MeasureProvider {
  create(ancestors: Field[]): Measure

  axis: "row" | "column"
}

type MeasureProviderType = Measure & MeasureProvider

function isMeasureProviderType(m: Measure): m is MeasureProviderType {
  return "create" in m && "axis" in m
}

class CompareWithGrandTotalAlongAncestors implements MeasureProviderType {
  readonly class: string = ""

  constructor(readonly alias: string, readonly underlying: Measure, readonly axis: "row" | "column") {
  }

  create(ancestors: Field[]): Measure {
    const ratio = comparisonMeasureWithGrandTotalAlongAncestors("percent_of_" + this.axis, ComparisonMethod.DIVIDE, this.underlying, ancestors)
    return multiply(this.alias, integer(100), ratio)
  }
}

class PercentOfParentAlongAncestors implements MeasureProviderType {
  readonly class: string = ""

  constructor(readonly alias: string, readonly underlying: Measure, readonly axis: "row" | "column") {
  }

  create(ancestors: Field[]): Measure {
    const ratio = comparisonMeasureWithParent("percent_of_parent_" + this.axis, ComparisonMethod.DIVIDE, this.underlying, ancestors)
    return multiply(this.alias, integer(100), ratio)
  }
}

const amount = sum("amount", spending.amount)
const popOfRow = new CompareWithGrandTotalAlongAncestors("amount - % on rows", amount, "row")
const popOfParentOnRows = new PercentOfParentAlongAncestors("amount - % parent on rows", amount, "row")
const popOfCol = new CompareWithGrandTotalAlongAncestors("amount - % on columns", amount, "column")
const popOfParentOnCols = new PercentOfParentAlongAncestors("amount - % parent on columns", amount, "column")
const popOfGT = multiply("amount - % of Grand Total", comparisonMeasureWithGrandTotal("amount_percent_gt", ComparisonMethod.DIVIDE, amount), integer(100))

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

  query(select: Field[], values: Measure[], pivotConfig: PivotConfig): QueryMerge | Query {
    const measures = values.map(m => {
      if (isMeasureProviderType(m) && m.axis === "row") {
        return m.create(pivotConfig.rows)
      } else if (isMeasureProviderType(m) && m.axis === "column") {
        return m.create(pivotConfig.columns)
      }
      return m
    })

    const gocIndex = select.indexOf(groupOfCountries)
    select = select.filter(f => f !== groupOfCountries)
    const columnSets = gocIndex >= 0 ? [new GroupColumnSet(groupOfCountries, spending.country, countryGroups)] : []

    return from(spending._name)
            .select(select, columnSets, measures)
            .build()
  }
}
