import {Measure, PivotConfig, Querier, TableField} from "@squashql/squashql-js"
import {QueryProvider} from "@/app/myQueryProvider"

const querier = new Querier("http://localhost:8080")

export class QueryExecutor {

  async executePivotQuery(rows: TableField[], columns: TableField[], values: Measure[]) {
    const select = rows.concat(columns)
    if (select.length === 0 || values.length === 0) {
      return undefined
    } else {
      const pivotConfig: PivotConfig = {
        rows,
        columns,
      }
      return querier.executePivotQuery(queryProvider.query(select, values), pivotConfig)
    }
  }
}

export const queryProvider: QueryProvider = new QueryProvider()
export const queryExecutor: QueryExecutor = new QueryExecutor()
