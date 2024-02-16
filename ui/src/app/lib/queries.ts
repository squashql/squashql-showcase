import {Measure, PivotConfig, Querier, TableField} from "@squashql/squashql-js"

import {QueryProvider} from "@/app/lib/queryProvider"

export class QueryExecutor {

  readonly querier = new Querier("http://localhost:8080")

  async executePivotQuery(queryProvider: QueryProvider, rows: TableField[], columns: TableField[], values: Measure[], minify: boolean) {
    const select = rows.concat(columns)
    if (select.length === 0 || values.length === 0) {
      return undefined
    } else {
      const pivotConfig: PivotConfig = {
        rows,
        columns,
      }
      const query = queryProvider.query(select, values, pivotConfig);
      query.minify = minify
      return this.querier.executePivotQuery(query, pivotConfig)
    }
  }
}

export const queryExecutor: QueryExecutor = new QueryExecutor()
