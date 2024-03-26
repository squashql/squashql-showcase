import {SheetComponent} from '@antv/s2-react'
import React from "react"
import {S2DataConfig, setLang} from "@antv/s2"
import {PivotTableQueryResult} from "@squashql/squashql-js"
import {HierarchyType} from "@/app/components/Dashboard"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"
import {defaultNumberFormatter} from "@/app/lib/formatters"

interface PivotTableProps {
  result: PivotTableQueryResult,
  hierarchyType: HierarchyType,
  height?: number,
  width?: number,
  formatters?: PivotTableCellFormatter[]
}

function showGrandTotals(fields: string[], hiddenTotals: string[]) {
  if (fields.length > 0) {
    return hiddenTotals.indexOf(fields[0]) < 0
  }
  // Nothing on rows, only values, no need to display the GT
  return false
}

function subTotalsDimensions(fields: string[], hiddenTotals: string[]): string[] {
  const a = []
  for (let i = 0; i < fields.length - 1; i++) {
    if (hiddenTotals.indexOf(fields[i + 1]) < 0) {
      a.push(fields[i])
    }
  }
  return a
}

export default function PivotTable(props: PivotTableProps) {
  if (!props?.result) {
    return
  }

  setLang("en_US")

  const layoutWidthType: 'adaptive' | 'colAdaptive' | 'compact' = 'compact'
  const subTotalsDimensionsRows = subTotalsDimensions(props.result.rows, props.result.hiddenTotals)
  const subTotalsDimensionsOnColumns = subTotalsDimensions(props.result.columns, props.result.hiddenTotals)

  const options = {
    height: props.height === undefined ? window.innerHeight - 20 : props.height,
    width: props.width === undefined ? window.innerWidth - 44 : props.width,
    showDefaultHeaderActionIcon: false,
    hierarchyType: props.hierarchyType,
    tooltip: {
      showTooltip: true,
      row: {
        showTooltip: true,
      },
    },
    style: {
      layoutWidthType,
    },
    interaction: {
      selectedCellsSpotlight: true,
      hoverHighlight: true,
      enableCopy: true,
      copyWithHeader: true,
      resize: true
    },
    totals: {
      row: {
        subTotalsDimensions: subTotalsDimensionsRows,
        showGrandTotals: showGrandTotals(props.result.rows, props.result.hiddenTotals),
        showSubTotals: {always: true},
        reverseLayout: true,
        reverseSubLayout: true,
        label: "Grand Total",
        subLabel: "Total",
      },
      col: {
        subTotalsDimensions: subTotalsDimensionsOnColumns,
        showGrandTotals: showGrandTotals(props.result.columns, props.result.hiddenTotals),
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
                    // header={header} commented out to avoid multiple warnings each time the pt is rendered.
            />
          </div>
  )
}

function buildData(result: PivotTableQueryResult, formatters?: PivotTableCellFormatter[]): S2DataConfig {
  const meta: PivotTableCellFormatter[] = []
  for (const v of result.values) {
    const index = formatters?.map(f => f.field).indexOf(v)
    if (!index || index < 0) {
      meta.push({
        field: v,
        formatter: defaultNumberFormatter.formatter
      })
    } else if (formatters) {
      meta.push(formatters[index])
    }
  }

  return {
    fields: {
      rows: result.rows,
      columns: result.columns,
      values: result.values,
      valueInCols: true,
    },
    data: result.cells,
    meta
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
