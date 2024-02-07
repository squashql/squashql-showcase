import {Measure, PivotConfig, Querier, TableField} from "@squashql/squashql-js"

import {QueryProvider} from "@/app/queryProvider"
import {PortfolioProvider} from "@/app/portfolioProvider"

export class QueryExecutor {

  readonly querier = new Querier("http://localhost:8080")

  async executePivotQuery(rows: TableField[], columns: TableField[], values: Measure[], minify: boolean) {
    const select = rows.concat(columns)
    if (select.length === 0 || values.length === 0) {
      return undefined
    } else {
      const pivotConfig: PivotConfig = {
        rows,
        columns,
        minify
      }
      return this.querier.executePivotQuery(queryProvider.query(select, values), pivotConfig)
    }
  }
}

export const queryProvider: QueryProvider = new PortfolioProvider()
export const queryExecutor: QueryExecutor = new QueryExecutor()
