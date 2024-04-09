import {
  all,
  any,
  Criteria,
  criterion,
  eq,
  Field,
  Measure,
  PivotConfig,
  Querier,
  TableField
} from "@squashql/squashql-js"

import {QueryProvider} from "@/app/lib/queryProvider"
import {url} from "@/app/lib/constants"
import {SelectableElement} from "@/app/components/AxisSelector"

export class QueryExecutor {

  readonly querier = new Querier(url)

  async executePivotQuery(queryProvider: QueryProvider, rows: SelectableElement[], columns: SelectableElement[], values: Measure[], filters: Map<Field, any[]>, minify: boolean) {
    const select = rows.concat(columns)
    if (select.length === 0 || values.length === 0) {
      return Promise.resolve()
    } else {
      const pivotConfig: PivotConfig = {
        rows: rows.map(r => r.type as TableField),
        columns: columns.map(r => r.type as TableField),
        hiddenTotals: select.filter(e => !e.showTotals).map(e => e.type as TableField),
      }

      const query = queryProvider.query(select.map(e => e.type as TableField), values, filters, pivotConfig)
      query.minify = minify
      return this.querier.executePivotQuery(query, pivotConfig)
    }
  }
}

export function toCriteria(filters: Map<Field, any[]>): Criteria {
  const sqlFilters: Criteria[] = []
  filters.forEach((values, key) => {
    const f = any(values.map(v => criterion(key, eq(v))))
    sqlFilters.push(f)
  })
  return all(sqlFilters)
}

export const queryExecutor: QueryExecutor = new QueryExecutor()
