import {Field, Measure, PivotConfig, Query, QueryMerge} from "@squashql/squashql-js"
import {SquashQLTable} from "@/app/lib/tables"

export interface QueryProvider {
  /**
   * the list of fields that can be used on row or column axis
   */
  selectableFields: Field[]
  /**
   * the list of measures that can be selected
   */
  measures: Measure[]

  /**
   * The tables that can be queried
   */
  table: SquashQLTable[]

  /**
   * The query to be executed
   */
  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query
}
