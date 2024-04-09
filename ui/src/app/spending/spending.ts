import {
  Axis,
  comparisonMeasureWithGrandTotal, comparisonMeasureWithParentOfAxis,
  comparisonMeasureWithPeriod, comparisonMeasureWithTotalOfAxis,
  ComparisonMethod,
  Field,
  from,
  integer,
  Measure,
  multiply,
  PivotConfig,
  Query,
  QueryMerge,
  sum,
  Year
} from "@squashql/squashql-js"
import {spending} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"

const amount = sum("amount", spending.amount)
const popOfRow = comparisonMeasureWithTotalOfAxis("amount - % of row", ComparisonMethod.DIVIDE, amount, Axis.ROW)
const popOfParentOnRows = comparisonMeasureWithParentOfAxis("amount - % of parent of row", ComparisonMethod.DIVIDE, amount, Axis.ROW)
const popOfCol = comparisonMeasureWithTotalOfAxis("amount - % of column", ComparisonMethod.DIVIDE, amount, Axis.COLUMN)
const popOfParentOnCols = comparisonMeasureWithParentOfAxis("amount - % of parent of column", ComparisonMethod.DIVIDE, amount, Axis.COLUMN)
const popOfGT = multiply("amount - % on grand total", comparisonMeasureWithGrandTotal("amount_percent_gt", ComparisonMethod.DIVIDE, amount), integer(100))

function createSpendingMeasures(): Measure[] {
  const yoyGrowth = comparisonMeasureWithPeriod(
          "YoY Growth",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.year, "y-1"]]),
          new Year(spending.year))
  return [amount, yoyGrowth, popOfCol, popOfRow, popOfGT, popOfParentOnRows, popOfParentOnCols]
}

function createSpendingFields(): Field[] {
  return [spending.spendingCategory, spending.spendingSubcategory, spending.continent, spending.country, spending.city, spending.year]
}

const spendingFields = createSpendingFields()
const spendingMeasures = createSpendingMeasures()

export class SpendingQueryProvider implements QueryProvider {

  readonly selectableFields = spendingFields
  readonly measures = spendingMeasures
  readonly formatters = []
  readonly table = [spending]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(spending._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
