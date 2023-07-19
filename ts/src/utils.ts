import {PivotTableQueryResult} from "@squashql/squashql-js"
import fs from "fs"

export function showInBrowser(pivotTable: PivotTableQueryResult) {
  let data = JSON.stringify({
    rows: pivotTable.rows,
    columns: pivotTable.columns,
    values: pivotTable.values,
    table: pivotTable.queryResult.table,
  })
  fs.writeFileSync('../target/classes/public/data.json', data);
  console.log(`http://localhost:8080`)
}
