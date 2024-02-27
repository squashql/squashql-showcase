import {
  countRows,
  Field,
  from,
  Measure,
  ParametrizedMeasure,
  PivotConfig,
  Query,
  QueryMerge
} from "@squashql/squashql-js"
import {portfolio} from "@/app/lib/tables"
import {isMeasureProviderType, QueryProvider} from "@/app/lib/queryProvider"
import {IncVarAncestors} from "@/app/lib/queries"

export const var95MeasureName = "VaR 95"
const var95 = new ParametrizedMeasure(var95MeasureName, "VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95
})

const incVar95 = new IncVarAncestors("Incr. VaR 95", "row")

export class PortfolioProvider implements QueryProvider {

  readonly selectableFields = portfolio._fields
  readonly measures = [countRows, var95, incVar95]

  query(select: Field[], values: Measure[], pivotConfig: PivotConfig): QueryMerge | Query {
    const measures = values.map(m => {
      if (isMeasureProviderType(m) && m.axis === "row") {
        return m.create(pivotConfig.rows)
      }
      return m
    })

    return from(portfolio._name)
            .select(select, [], measures)
            .build()
  }
}
