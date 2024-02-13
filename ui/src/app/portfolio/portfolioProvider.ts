import {Field, from, Measure, Query, QueryMerge, sum, countRows, max} from "@squashql/squashql-js"
import {portfolio} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"

export class PortfolioProvider implements QueryProvider {

  readonly selectableFields = portfolio._fields
  readonly measures = [countRows, sum("scenarioValue_sum", portfolio.scenarioValue), max("scenarioValue_max", portfolio.scenarioValue)]

  query(select: Field[], values: Measure[]): QueryMerge | Query {
    return from(portfolio._name)
            .select(select, [], values)
            .build()
  }
}
