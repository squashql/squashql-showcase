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
  from, gt, le, lt,
  Measure,
  neq,
  PivotConfig,
  Query,
  QueryMerge,
  sumIf,
  Year,
} from "@squashql/squashql-js"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"
import {percentFormatter} from "@/app/lib/formatters"
import {SquashQLTable} from "@/app/lib/tables"
import {ForecastFields} from "@/app/financialplanning/page"

interface MeasureConfig {
  measures: Measure[]
  formatters: PivotTableCellFormatter[]
}

function createMeasures(forecast: ForecastFields | undefined, year: number, month?: number): MeasureConfig {
  if (forecast && forecast.pnl && forecast.type && forecast.accrual && forecast.year && forecast.month) {
    let criteriaActual
    if (month) {
      criteriaActual = any([
        all([criterion(forecast.year, eq(year)), criterion(forecast.month, le(month)), criterion(forecast.type, eq("actual"))]),
        all([criterion(forecast.year, lt(year)), criterion(forecast.type, eq("actual"))]),
        all([criterion(forecast.year, eq(year)), criterion(forecast.month, gt(month)), criterion(forecast.type, eq("model"))]),
        all([criterion(forecast.year, gt(year)), criterion(forecast.type, eq("model"))]),
      ])
    } else {
      criteriaActual = any([
        all([criterion(forecast.year, le(year)), criterion(forecast.type, eq("actual"))]),
        all([criterion(forecast.year, gt(year)), criterion(forecast.type, eq("model"))])
      ])
    }

    const criteriaRevenueActual = all([
      criterion(forecast.pnl, eq("Revenue")),
      criteriaActual
    ])

    const criteriaRevenueModel = all([
      criterion(forecast.pnl, eq("Revenue")),
      criterion(forecast.type, eq("model"))
    ])

    const criteriaExpenseActual = all([
      criterion(forecast.pnl, neq("Revenue")),
      criteriaActual
    ])

    const criteriaExpenseModel = all([
      criterion(forecast.pnl, neq("Revenue")),
      criterion(forecast.type, eq("model"))
    ])

    const revenueActual = sumIf("Rev Actl/Fcst", forecast.accrual, criteriaRevenueActual)
    const revenueModel = sumIf("Rev Fcst", forecast.accrual, criteriaRevenueModel)

    const expenseActual = sumIf("Exp Actl/Fcst", forecast.accrual, criteriaExpenseActual)
    const expenseModel = sumIf("Exp Fcst", forecast.accrual, criteriaExpenseModel)

    const pnlActual = sumIf("Pnl Act/Fcst", forecast.accrual, criteriaActual)
    const pnlModel = sumIf("Pnl Fcst", forecast.accrual, criterion(forecast.type, eq("model")))

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
              new Map([[forecast.year, "y-1"]]),
              new Year(forecast.year)))
      yoyFormatters.push(new PivotTableCellFormatter(alias, percentFormatter))
    }

    const formatters = [
      new PivotTableCellFormatter(marginRateActual.alias, percentFormatter),
      new PivotTableCellFormatter(marginRateModel.alias, percentFormatter)
    ].concat(yoyFormatters)

    return {
      measures: a.concat(countRows).concat(yoy),
      formatters
    }
  } else {
    return {
      measures: [countRows],
      formatters: []
    }
  }
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

  readonly selectableFields = this.forecastTable._fields
  readonly measures: Measure[]
  readonly formatters: PivotTableCellFormatter[]
  readonly table

  constructor(readonly forecastTable: SquashQLTable, readonly mapping: ForecastFields | undefined, readonly year: number, readonly month?: number) {
    const config = createMeasures(this.mapping, this.year, this.month)
    this.measures = config.measures
    this.formatters = config.formatters
    this.table = [this.forecastTable]
  }

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(this.forecastTable._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
