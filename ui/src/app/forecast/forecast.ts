import {
  all,
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
  sumIf
} from "@squashql/squashql-js"
import {forecast} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"

const value = sum("value", forecast.accrual)
const revenue = sumIf("Revenue", forecast.accrual, criterion(forecast.pnl, eq("Revenue")))
const expense = sumIf("Expense", forecast.accrual, criterion(forecast.pnl, neq("Revenue")))
const subscription = sumIf("Subscription", forecast.accrual, criterion(forecast.class, eq("Subscription")))
const decSubscription = multiply("Dec. Subscription", sumIf("__dec__subscription__", forecast.accrual, all([
  criterion(forecast.class, eq("Subscription")),
  criterion(forecast.accrualMonth, eq(12)),
])), integer(12))
const marginRate = multiply("margin %", divide("__margin__", value, revenue), integer(100))

////////////////////////////////////////////////////////////////
// Commented because we can build those measures from the UI ///
////////////////////////////////////////////////////////////////

// const yoyPerc = multiply("YoY % value Growth", comparisonMeasureWithPeriod(
//         "__yoy_perc_value",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         value,
//         new Map([[forecast.accrualYear, "y-1"]]),
//         new Year(forecast.accrualYear)), integer(100))
// const yoyAbs = comparisonMeasureWithPeriod(
//         "YoY value Growth",
//         ComparisonMethod.ABSOLUTE_DIFFERENCE,
//         value,
//         new Map([[forecast.accrualYear, "y-1"]]),
//         new Year(forecast.accrualYear))
// const growth = multiply("Growth %", comparisonMeasureWithPeriod(
//         "__growth__perc__",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         revenue,
//         new Map([[forecast.accrualYear, "y-1"]]),
//         new Year(forecast.accrualYear)), integer(100))
// const growthSubscription = multiply("Growth Subscription %", comparisonMeasureWithPeriod(
//         "__growth__subscription__perc__",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         subscription,
//         new Map([[forecast.accrualYear, "y-1"]]),
//         new Year(forecast.accrualYear)), integer(100))
// const decGrowthSubscription = multiply("Dec. Growth %", comparisonMeasureWithPeriod(
//         "__dec__growth__perc__",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         decSubscription,
//         new Map([[forecast.accrualYear, "y-1"]]),
//         new Year(forecast.accrualYear)), integer(100))
// const popOfParentOnRowsRevenue = new PercentOfParentAlongAncestors("Revenue - % parent on rows", revenue, "row")
// const popOfParentOnRowsNotRevenue = new PercentOfParentAlongAncestors("Expense - % parent on rows", expense, "row")
// const ebitda = plus("EBITDA", yoyPerc, growth)

export class ForecastQueryProvider implements QueryProvider {

  readonly selectableFields = forecast._fields
  readonly measures = [value, marginRate, revenue, expense, subscription, decSubscription]
  readonly table = [forecast]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(forecast._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
