import {
  all,
  any,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  countRows,
  criterion,
  divide,
  eq,
  Field,
  from,
  Measure,
  neq,
  PivotConfig,
  plus,
  Query,
  QueryMerge,
  sumIf,
  Year,
} from "@squashql/squashql-js"
import {forecast} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"
import {percentFormatter} from "@/app/lib/formatters"

const criteriaRevenueActual = all([
  criterion(forecast.pnl, eq("Revenue")),
  any([
            all([criterion(forecast.accrualYear, eq(2023)), criterion(forecast.type, eq("actual"))]),
            all([criterion(forecast.accrualYear, neq(2023)), criterion(forecast.type, eq("model"))])
          ]
  )
])

const criteriaRevenueModel = all([
  criterion(forecast.pnl, eq("Revenue")),
  criterion(forecast.type, eq("model"))
])

const criteriaExpenseActual = all([
  criterion(forecast.pnl, neq("Revenue")),
  any([
            all([criterion(forecast.accrualYear, eq(2023)), criterion(forecast.type, eq("actual"))]),
            all([criterion(forecast.accrualYear, neq(2023)), criterion(forecast.type, eq("model"))])
          ]
  )
])

const criteriaExpenseModel = all([
  criterion(forecast.pnl, neq("Revenue")),
  criterion(forecast.type, eq("model"))
])

const revenueActual = sumIf("Rev Actl/Fcst", forecast.accrual, criteriaRevenueActual)
const revenueModel = sumIf("Rev Fcst", forecast.accrual, criteriaRevenueModel)

const expenseActual = sumIf("Exp Actl/Fcst", forecast.accrual, criteriaExpenseActual)
const expenseModel = sumIf("Exp Fcst", forecast.accrual, criteriaExpenseModel)

const pnlActual = plus("Pnl Act/Fcst", revenueActual, expenseActual)
const pnlModel = plus("Pnl Fcst", revenueModel, expenseModel)

const marginRateActual = divide("Margin Act/Fcst", pnlActual, revenueActual)
const marginRateModel = divide("Margin Fcst", pnlModel, revenueModel)

const a: Measure[] = [
  revenueActual, revenueModel,
  expenseActual, expenseModel,
  pnlActual, pnlModel,
  marginRateActual, marginRateModel,
]
const yoy: Measure[] = []
const yoyFormatters: PivotTableCellFormatter[] = []
for (const m of a) {
  const alias = `YoY % ${m.alias} Growth`
  yoy.push(comparisonMeasureWithPeriod(
          alias,
          ComparisonMethod.RELATIVE_DIFFERENCE,
          m,
          new Map([[forecast.accrualYear, "y-1"]]),
          new Year(forecast.accrualYear)))
  yoyFormatters.push(new PivotTableCellFormatter(alias, percentFormatter))
}
// const subscription = sumIf("Subscription", forecast.accrual, criterion(forecast.class, eq("Subscription")))
// const decSubscription = multiply("Dec. Subscription", sumIf("__dec__subscription__", forecast.accrual, all([
//   criterion(forecast.class, eq("Subscription")),
//   criterion(forecast.accrualMonth, eq(12)),
// ])), integer(12))

////////////////////////////////////////////////////////////////
// Commented because we can build those measures from the UI ///
////////////////////////////////////////////////////////////////

// const popOfParentOnRowsRevenue = new PercentOfParentAlongAncestors("Revenue - % parent on rows", revenue, "row")
// const popOfParentOnRowsNotRevenue = new PercentOfParentAlongAncestors("Expense - % parent on rows", expense, "row")
// const ebitda = plus("EBITDA", yoyPerc, growth)

export class ForecastQueryProvider implements QueryProvider {

  readonly selectableFields = forecast._fields
  readonly measures = a.concat(countRows).concat(yoy)
  readonly formatters = [
    new PivotTableCellFormatter(marginRateActual.alias, percentFormatter),
    new PivotTableCellFormatter(marginRateModel.alias, percentFormatter)
  ].concat(yoyFormatters)
  readonly table = [forecast]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(forecast._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
