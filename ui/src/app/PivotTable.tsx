import {SheetComponent} from '@antv/s2-react'
import React from "react"
import {Data, S2DataConfig} from "@antv/s2";
import {PivotTableQueryResult} from "@squashql/squashql-js/dist/querier";

type PivotTableProps = {
  result: PivotTableQueryResult
}

export function PivotTable(props: PivotTableProps) {
  if (!props?.result) {
    return
  }

  const options = {
    height: window.innerHeight - 30,
    width: window.innerWidth - 30,
    showDefaultHeaderActionIcon: false,
    hierarchyType: 'tree',
    tooltip: {
      showTooltip: true,
      row: {
        showTooltip: true,
      },
    },
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: {always: true},
        reverseLayout: true,
        reverseSubLayout: true,
        label: "Grand Total",
        subLabel: "Total",
      },
      col: {
        showGrandTotals: true,
        showSubTotals: {always: true},
        reverseLayout: true,
        reverseSubLayout: true,
        label: "Grand Total",
        subLabel: "Total",
      },
    }
  }

  const s2Palette = {
    basicColors: [
      "#000000",
      "#FFFBF2",
      "#FFF4D9",
      "#FFB304",
      "#D99803",
      "#D99803",
      "#D99803",
      "#FFB304",
      "#FFFFFF",
      "#FFF4D9",
      "#FFBE2A",
      "#FFBE2A",
      "#FFB304",
      "#000000",
      "#000000"
    ],

    // ---------- semantic colors ----------
    semanticColors: {
      red: '#FF4D4F',
      green: '#29A294',
    },
  }

  return (
          <div>
            <SheetComponent dataCfg={buildData(props.result)} options={options} themeCfg={{
              palette: s2Palette
            }}/>
          </div>
  )
}

function isSquashQLTotal(value: any): boolean {
  return value === "Grand Total" || value === "Total"
}

function buildData(result: PivotTableQueryResult): S2DataConfig {
  const table = result.queryResult.table
  const data: Data[] = [] // see data.js to see the expected format
  table.rows.forEach((row: Data[]) => {
    const r: Data = {};
    row.forEach((col, colIndex) => {
      const field = table.columns[colIndex];
      if (!isSquashQLTotal(col)) {
        // @ts-ignore
        r[field] = col
      }
    })
    data.push(r)
  })

  return {
    fields: {
      rows: result.rows,
      columns: result.columns,
      values: result.values,
      valueInCols: true,
    },
    data
  }
}
