import {countRows, from, Measure, PivotConfig, Querier, TableField, PivotTableQueryResult} from "@squashql/squashql-js";
import {portfolio} from "@/app/tables";

export const measures = [countRows]
export const initialSelectElements = portfolio._fields

const querier = new Querier("http://localhost:8080")

export async function executePivotQuery(rows: TableField[], columns: TableField[], values: Measure[]) {
  const select = rows.concat(columns)
  if (select.length === 0) {
    return undefined
  } else {
    const query = from(portfolio._name)
            .select(select, [], values)
            .build();

    const pivotConfig: PivotConfig = {
      rows,
      columns,
    }

    return querier.executePivotQuery(query, pivotConfig)
  }
}


