import {
  countRows,
  Field,
  from,
  Measure,
  ParametrizedMeasure,
  PivotConfig,
  Query,
  QueryMerge, sum
} from "@squashql/squashql-js"
import {portfolio} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {IncVarAncestors, toCriteria} from "@/app/lib/queries"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"
import {defaultNumberFormatter, var95f} from "@/app/lib/formatters"

const var95 = new ParametrizedMeasure("VaR 95", "VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95
})

const incVar95 = new IncVarAncestors("Incr. VaR 95", "row")
const pnl = sum("PnL", portfolio.scenarioValue)

const varFormatter = (value: any) => {
  if (value) {
    const localeDateString = new Date(value[0][0], value[0][1] - 1, value[0][2]).toLocaleDateString()
    return `${defaultNumberFormatter.formatter(value[1])}\n${localeDateString}`
  }
  return ""
}

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
