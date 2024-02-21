import {
  all,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  criterion, divide,
  eq,
  Field,
  from,
  integer,
  Measure,
  multiply, neq,
  PivotConfig, plus,
  Query,
  QueryMerge,
  sum,
  sumIf,
  Year
} from "@squashql/squashql-js"
import {forecast} from "@/app/lib/tables"
import {isMeasureProviderType, QueryProvider} from "@/app/lib/queryProvider"
import {PercentOfParentAlongAncestors} from "@/app/lib/queries"

const value = sum("value", forecast.accrual)
const revenue = sumIf("Revenue", forecast.accrual, criterion(forecast.pnl, eq("Revenue")))
const expense = sumIf("Expense", forecast.accrual, criterion(forecast.pnl, neq("Revenue")))
const subscription = sumIf("Subscription", forecast.accrual, criterion(forecast.class, eq("Subscription")))
const decSubscription = multiply("Dec. Subscription", sumIf("__dec__subscription__", forecast.accrual, all([
  criterion(forecast.class, eq("Subscription")),
  criterion(forecast.accrualMonth, eq(12)),
])), integer(12))
const marginRate = multiply("margin %", divide("__margin__", value, revenue), integer(100))

const yoyPerc = multiply("YoY % value Growth", comparisonMeasureWithPeriod(
        "__yoy_perc_value",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        value,
        new Map([[forecast.accrualYear, "y-1"]]),
        new Year(forecast.accrualYear)), integer(100))
const yoyAbs = comparisonMeasureWithPeriod(
        "YoY value Growth",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        value,
        new Map([[forecast.accrualYear, "y-1"]]),
        new Year(forecast.accrualYear))
const growth = multiply("Growth %", comparisonMeasureWithPeriod(
        "__growth__perc__",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        revenue,
        new Map([[forecast.accrualYear, "y-1"]]),
        new Year(forecast.accrualYear)), integer(100))
const growthSubscription = multiply("Growth Subscription %", comparisonMeasureWithPeriod(
        "__growth__subscription__perc__",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        subscription,
        new Map([[forecast.accrualYear, "y-1"]]),
        new Year(forecast.accrualYear)), integer(100))
const decGrowthSubscription = multiply("Dec. Growth %", comparisonMeasureWithPeriod(
        "__dec__growth__perc__",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        decSubscription,
        new Map([[forecast.accrualYear, "y-1"]]),
        new Year(forecast.accrualYear)), integer(100))
const ebitda = plus("EBITDA", yoyPerc, growth)

const popOfParentOnRowsRevenue = new PercentOfParentAlongAncestors("Revenue - % parent on rows", revenue, "row")
const popOfParentOnRowsNotRevenue = new PercentOfParentAlongAncestors("Expense - % parent on rows", expense, "row")


export class ForecastQueryProvider implements QueryProvider {

  readonly selectableFields = forecast._fields
  readonly measures = [value, yoyPerc, yoyAbs,
    marginRate, growth, ebitda,
    growthSubscription, decGrowthSubscription, revenue, expense,
    subscription, decSubscription, popOfParentOnRowsRevenue, popOfParentOnRowsNotRevenue]

  query(select: Field[], values: Measure[], pivotConfig: PivotConfig): QueryMerge | Query {
    const measures = values.map(m => {
      if (isMeasureProviderType(m) && m.axis === "row") {
        return m.create(pivotConfig.rows)
      } else if (isMeasureProviderType(m) && m.axis === "column") {
        return m.create(pivotConfig.columns)
      }
      return m
    })

    return from(forecast._name)
            .select(select, [], measures)
            .build()
  }
}
