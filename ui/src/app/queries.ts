import {countRows, from, PivotConfig, TableField} from "@squashql/squashql-js";

class Portfolios {
  readonly _name = "portfolios"
  readonly ticker: TableField = new TableField("portfolios.Ticker")
  readonly dateScenario: TableField = new TableField("portfolios.DateScenario")
  readonly currency: TableField = new TableField("portfolios.Currency")
  readonly riskType: TableField = new TableField("portfolios.RiskType")
  readonly scenarioValue: TableField = new TableField("portfolios.ScenarioValue")
}

const portfolios = new Portfolios()

export const initialSelectElements = [portfolios.ticker, portfolios.currency]
export const measures = [countRows]


const query = from(portfolios._name)
        .select(initialSelectElements, [], measures)
        .build()

const pivotConfig: PivotConfig = {
  rows: [portfolios.ticker],
  columns: [portfolios.currency],
}
console.log(query)

// querier
//         .executePivotQuery(query, pivotConfig)
//         .then(r => {
//           const pivotTable: PivotTableQueryResult = r as PivotTableQueryResult
//           let data = {
//             rows: pivotTable.rows,
//             columns: pivotTable.columns,
//             values: pivotTable.values,
//             table: pivotTable.queryResult.table,
//           }
//           // @ts-ignore
//           transform(data)
//           setRawData(data)
//           console.log("=== data received ===")
//           console.log(data)
//         })
