import {Field, Measure, PivotConfig, Query, QueryMerge} from "@squashql/squashql-js"
import {SquashQLTable} from "@/app/lib/tables";

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
  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query

  table: SquashQLTable[]
}

interface MeasureProvider {
  create(ancestors: Field[]): Measure

  axis: "row" | "column"
}

export type MeasureProviderType = Measure & MeasureProvider

export function isMeasureProviderType(m: Measure): m is MeasureProviderType {
  return "create" in m && "axis" in m
}
