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
import {var95f} from "@/app/lib/formatters"

const var95 = new ParametrizedMeasure("VaR 95", "VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95
})

const incVar95 = new ParametrizedMeasure("Incr. VaR 95", "INCREMENTAL_VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95,
  "axis": Axis.COLUMN
})
const pnl = sum("PnL", portfolio.scenarioValue)

export class PortfolioProvider implements QueryProvider {

  readonly selectableFields = portfolio._fields
  readonly measures = [countRows, pnl, var95, incVar95]
  readonly formatters = [new PivotTableCellFormatter(var95.alias, var95f)]
  readonly table = [portfolio]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(portfolio._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
