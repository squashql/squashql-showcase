import {Field, Measure, PivotConfig, Query, QueryMerge} from "@squashql/squashql-js"

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
   * The query to be executed
   */
  query(select: Field[], values: Measure[], pivotConfig: PivotConfig): QueryMerge | Query
}
