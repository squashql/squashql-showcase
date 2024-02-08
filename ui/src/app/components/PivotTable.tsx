import {SheetComponent} from '@antv/s2-react'
import React from "react"
import {Data, S2DataConfig} from "@antv/s2"
import {PivotTableQueryResult} from "@squashql/squashql-js"

interface PivotTableProps {
  result: PivotTableQueryResult
}

export default function PivotTable(props: PivotTableProps) {
  if (!props?.result) {
    return
  }

  const hierarchyType: 'grid' | 'tree' | 'customTree' = 'tree'
  const options = {
    height: window.innerHeight - 20,
    width: window.innerWidth - 20,
    showDefaultHeaderActionIcon: false,
    hierarchyType,
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

function buildData(result: PivotTableQueryResult): S2DataConfig {
  const data: Data[] = [] // see data.js to see the expected format
  result.cells.forEach((cell: Map<string, any>) => {
    const r: Data = {}
    Object.entries(cell).forEach(entry => {
      r[entry[0]] = typeof entry[1] === 'number' ? (Math.round(entry[1] * 100) / 100).toFixed(2) : entry[1]
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
