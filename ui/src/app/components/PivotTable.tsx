import {SheetComponent} from '@antv/s2-react'
import React from "react"
import {Data, S2DataConfig, setLang} from "@antv/s2"
import {PivotTableQueryResult} from "@squashql/squashql-js"
import {Formatter} from "@/app/components/Dashboard"
import {formatNumber} from "@/app/lib/utils"

interface PivotTableProps {
  result: PivotTableQueryResult,
  height?: number,
  width?: number,
  colShowGrandTotal?: boolean,
  formatters?: Formatter[]
}

export default function PivotTable(props: PivotTableProps) {
  if (!props?.result) {
    return
  }

  setLang("en_US")

  const hierarchyType: 'grid' | 'tree' | 'customTree' = 'tree'
  const options = {
    height: props.height === undefined ? window.innerHeight - 20 : props.height,
    width: props.width === undefined ? window.innerWidth - 20 : props.width,
    showDefaultHeaderActionIcon: false,
    hierarchyType,
    tooltip: {
      showTooltip: true,
      row: {
        showTooltip: true,
      },
    },
    interaction: {
      selectedCellsSpotlight: true,
      hoverHighlight: true,
      enableCopy: true,
      copyWithHeader: true,
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
        showGrandTotals: props.colShowGrandTotal === undefined ? true : props.colShowGrandTotal,
        showSubTotals: {always: true},
        reverseLayout: true,
        reverseSubLayout: true,
        label: "Grand Total",
        subLabel: "Total",
      },
    }
  }

  const themeCfg = {
    palette: s2Palette
  }
  const header = {
    exportCfg: {
      open: true
    }
  }

  return (
          <div>
            <SheetComponent dataCfg={buildData(props.result, props.formatters)}
                            options={options}
                            themeCfg={themeCfg}
                            header={header}/>
          </div>
  )
}

function buildData(result: PivotTableQueryResult, formatters?: Formatter[]): S2DataConfig {
  let data: Data[] = [] // see data.js to see the expected format
  result.cells.forEach((cell: Record<string, any>) => {
    const r: Data = {}
    Object.entries(cell).forEach(entry => r[entry[0]] = formatNumber(entry[1]))
    data.push(r)
  })
  console.log(data)
  return {
    fields: {
      rows: result.rows,
      columns: result.columns,
      values: result.values,
      valueInCols: true,
    },
    data,
    meta: formatters
  }
}

export const s2Palette = {
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
