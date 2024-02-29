import {
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  criterion,
  divide,
  eq,
  Field,
  from,
  integer,
  Measure,
  multiply,
  neq,
  PivotConfig,
  Query,
  QueryMerge,
  sum,
  sumIf,
  Year
} from "@squashql/squashql-js"
import {forecast} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"

const value = sum("value", forecast.accrual)
const revenue = sumIf("Revenue", forecast.accrual, criterion(forecast.pnl, eq("Revenue")))
const expense = sumIf("Expense", forecast.accrual, criterion(forecast.pnl, neq("Revenue")))
const subscription = sumIf("Subscription", forecast.accrual, criterion(forecast.class, eq("Subscription")))
const marginRate = multiply("margin %", divide("__margin__", value, revenue), integer(100))

const growth = multiply("Growth %", comparisonMeasureWithPeriod(
        "__growth__perc__",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        revenue,
        new Map([[forecast.accrualYear, "y-1"]]),
        new Year(forecast.accrualYear)), integer(100))

export class MonthlyForecastQueryProvider implements QueryProvider {

  readonly selectableFields = forecast._fields
  readonly measures = [value, marginRate, growth, revenue, expense, subscription]
  readonly table = [forecast]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(forecast._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
