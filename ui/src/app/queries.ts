import {Measure, PivotConfig, Querier, TableField} from "@squashql/squashql-js"
import {QueryProvider} from "@/app/myQueryProvider"
import {population, spending} from "@/app/tables";

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

  async executePivotQueryMerge(minify: boolean) {
    const pivotConfig: PivotConfig = {
      rows: [population.continent.as("continent"), population.country.as("country")],
      columns: [spending.spendingCategory],
      minify
    }
    return this.querier.executePivotQuery(queryProvider.queryMerge(), pivotConfig)
  }
}

export const queryProvider: QueryProvider = new QueryProvider()
export const queryExecutor: QueryExecutor = new QueryExecutor()
