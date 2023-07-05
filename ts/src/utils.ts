import {PivotTableQueryResult} from "@squashql/squashql-js"

export function showInBrowser(pivotTable: PivotTableQueryResult) {
  let encodedTable = btoa(JSON.stringify({
    rows: pivotTable.rows,
    columns: pivotTable.columns,
    values: pivotTable.values,
    table: pivotTable.queryResult.table,
  }));
  console.log(`http://localhost:8080?data=${encodedTable}`)
}
