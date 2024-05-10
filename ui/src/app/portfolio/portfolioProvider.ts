import {
  Axis,
  countRows,
  Field,
  from,
  Measure,
  ParametrizedMeasure,
  PivotConfig,
  Query,
  QueryMerge,
  sum
} from "@squashql/squashql-js"
import {portfolio} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"
import {var95fDateOnly} from "@/app/lib/formatters"

const var95 = new ParametrizedMeasure("VaR 95", "VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95,
  "return": "value"
})

const var95Date = new ParametrizedMeasure("VaR 95 - Date", "VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95,
  "return": "date"
})

const incVar95 = new ParametrizedMeasure("Incr. VaR 95", "INCREMENTAL_VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95,
  "axis": Axis.COLUMN
})

const overallIncVar95 = new ParametrizedMeasure("Overall Incr. VaR 95", "OVERALL_INCREMENTAL_VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95,
  "axis": Axis.COLUMN
})

const pnl = sum("PnL", portfolio.scenarioValue)

export class PortfolioProvider implements QueryProvider {

  readonly selectableFields = portfolio._fields
  readonly measures = [countRows, pnl, var95, var95Date, incVar95, overallIncVar95]
  readonly formatters = [new PivotTableCellFormatter(var95Date.alias, var95fDateOnly)]
  readonly table = [portfolio]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(portfolio._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
