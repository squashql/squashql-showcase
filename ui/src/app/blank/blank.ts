import {countRows, Field, from, Measure, PivotConfig, Query, QueryMerge,} from "@squashql/squashql-js"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"
import {SquashQLTable} from "@/app/lib/tables"

export class BlankQueryProvider implements QueryProvider {

  readonly selectableFields
  readonly measures: Measure[]
  readonly formatters: PivotTableCellFormatter[]
  readonly table

  constructor(table: SquashQLTable) {
    this.measures = [countRows]
    this.formatters = []
    this.table = [table]
    this.selectableFields = table._fields
  }

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    return from(this.table[0]._name)
            .where(toCriteria(filters))
            .select(select, [], values)
            .build()
  }
}
