import {Measure, PivotConfig, Querier, Query, TableField} from "@squashql/squashql-js";
import {MyQueryProvider} from "@/app/myQueryProvider";

const querier = new Querier("http://localhost:8080")
export const queryProvider: QueryProvider = new MyQueryProvider()

export async function executePivotQuery(rows: TableField[], columns: TableField[], values: Measure[]) {
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

export interface QueryProvider {
  query(select: TableField[], values: Measure[]): Query
  selectableFields(): TableField[] // the list of fields that can be used on row or column axis
  measures(): Measure[] // the list of measures that can be selected
}


