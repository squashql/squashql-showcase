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
import {IncVarAncestors, toCriteria} from "@/app/lib/queries"

const var95 = new ParametrizedMeasure("VaR 95", "VAR", {
  "value": portfolio.scenarioValue,
  "date": portfolio.dateScenario,
  "quantile": 0.95
})

const incVar95 = new IncVarAncestors("Incr. VaR 95", "row")

export class PortfolioProvider implements QueryProvider {

  readonly selectableFields = portfolio._fields
  readonly measures = [countRows, var95, incVar95]
  readonly table = [portfolio]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    const measures = values.map(m => {
      if (isMeasureProviderType(m) && m.axis === "row") {
        return m.create(pivotConfig.rows)
      }
      return m
    })

    return from(portfolio._name)
            .where(toCriteria(filters))
            .select(select, [], measures)
            .build()
  }
}
