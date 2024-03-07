'use client'
import React, {useState} from "react"
import AxisSelector, {AxisType, SelectableElement} from "@/app/components/AxisSelector"
import {Field, Measure, PivotTableQueryResult, TableField} from "@squashql/squashql-js"
import {queryExecutor} from "@/app/lib/queries"
import dynamic from "next/dynamic"
import {QueryProvider} from "@/app/lib/queryProvider"
import HierarchicalMeasureBuilder from "@/app/components/HierarchicalMeasureBuilder"
import TimeComparisonMeasureBuilder from "@/app/components/TimeComparisonMeasureBuilder"
import CalculatedMeasureBuilder from "@/app/components/CalculatedMeasureBuilder"

export interface Formatter {
  field: string
  formatter: (v: any) => string
}

interface DashboardProps {
  title: string
  queryProvider: QueryProvider
  formatters?: Formatter[]
  elements?: React.JSX.Element[]
}

function fieldToSelectableElement(f: Field) {
  return {
    type: f,
    showTotals: true
  }
}

function measureToSelectableElement(m: Measure) {
  return {
    type: m,
    showTotals: true
  }
}

// disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
const PivotTable = dynamic(() => import("@/app/components/PivotTable"), {ssr: false})
const FiltersSelector = dynamic(() => import("@/app/components/FiltersSelector"), {ssr: false})

export default function Dashboard(props: DashboardProps) {
  const queryProvider = props.queryProvider
  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [rows, setRows] = useState<SelectableElement[]>([])
  const [columns, setColumns] = useState<SelectableElement[]>([])
  const [filters, setFilters] = useState<SelectableElement[]>([])
  const [selectableElements, setSelectableElements] = useState<SelectableElement[]>(queryProvider.selectableFields.map(fieldToSelectableElement))
  const [selectableFilters, setSelectableFilters] = useState<SelectableElement[]>(queryProvider.selectableFields.map(fieldToSelectableElement))
  const [selectableValues, setSelectableValues] = useState<SelectableElement[]>(queryProvider.measures.map(measureToSelectableElement))
  const [values, setValues] = useState<SelectableElement[]>([])
  const [minify, setMinify] = useState<boolean>(true)
  const [filtersValues, setFiltersValues] = useState<Map<Field, any[]>>(new Map())

  function refresh(newElements: SelectableElement[], type: AxisType) {
    let r = rows
    let c = columns
    let v = values
    let fv = filtersValues
    switch (type) {
      case AxisType.ROWS:
        r = newElements
        break
      case AxisType.COLUMNS:
        c = newElements
        break
      case AxisType.VALUES:
        v = newElements
        break
      case AxisType.FILTERS:
        // Special case for the filters to handle elements being removed
        const copy = new Map(fv)
        for (let [key, __] of copy) {
          if (newElements.map(e => e.type).indexOf(key) < 0) {
            copy.delete(key)
          }
        }
        setFiltersValues(fv = copy)
        break
    }
    return executeAndSetResult(r, c, v, fv, minify)
  }

  function refreshFromState() {
    return executeAndSetResult(rows, columns, values, filtersValues, minify)
  }

  function toggleMinify() {
    setMinify(!minify)
    executeAndSetResult(rows, columns, values, filtersValues, !minify)
  }

  function executeAndSetResult(rows: SelectableElement[], columns: SelectableElement[], values: SelectableElement[], filters: Map<Field, any[]>, minify: boolean) {
    return queryExecutor.executePivotQuery(
            queryProvider,
            rows,
            columns,
            values.map(e => e.type as Measure),
            filters,
            minify)
            .then(r => setPivotQueryResult(r as PivotTableQueryResult))
  }

  function onFilterChange(field: Field, filterValues: any[]) {
    filtersValues.set(field, filterValues)
    const copy = new Map(filtersValues)
    setFiltersValues(copy)
    executeAndSetResult(rows, columns, values, copy, minify)
  }

  return (
          <div className="px-1">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="../">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">{props.title}</li>
              </ol>
            </nav>
            <AxisSelector axisType={AxisType.ROWS}
                          elements={rows}
                          selectableElements={selectableElements}
                          elementsDispatcher={setRows}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={refresh}
                          showTotalsCheckBox={true}/>
            <AxisSelector axisType={AxisType.COLUMNS}
                          elements={columns}
                          selectableElements={selectableElements}
                          elementsDispatcher={setColumns}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={refresh}
                          showTotalsCheckBox={true}/>
            <AxisSelector axisType={AxisType.VALUES}
                          elements={values}
                          selectableElements={selectableValues}
                          elementsDispatcher={setValues}
                          selectableElementsDispatcher={setSelectableValues}
                          queryResultDispatcher={refresh}
                          showTotalsCheckBox={false}/>
            <AxisSelector axisType={AxisType.FILTERS}
                          elements={filters}
                          selectableElements={selectableFilters}
                          elementsDispatcher={setFilters}
                          selectableElementsDispatcher={setSelectableFilters}
                          queryResultDispatcher={refresh}
                          showTotalsCheckBox={false}/>
            {filters?.map((element, index) => (
                    <FiltersSelector key={index}
                                     table={queryProvider.table[0]} // FIXME it only handles 1 table for the time being
                                     field={(element.type as Field)}
                                     filters={filtersValues}
                                     onFilterChange={onFilterChange}/>))}
            {/* Refresh button + Minify option + other elements */}
            <div className="row row-cols-auto">
              <div className="col py-2">
                <button type="button" className="btn btn-sm btn-light" onClick={refreshFromState}>Refresh</button>
              </div>
              <div className="col px-1 py-2">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={minify}
                       onChange={toggleMinify}/>
                <label className="form-check-label px-1" htmlFor="flexCheckChecked">Minify</label>
              </div>
              <div className="col px-1 py-2">
                <CalculatedMeasureBuilder
                        measures={selectableValues.concat(values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        onNewMeasure={m => {
                          const copy = [...selectableValues]
                          copy.push(measureToSelectableElement(m))
                          setSelectableValues(copy)
                        }}/>
              </div>
              <div className="col px-1 py-2">
                <TimeComparisonMeasureBuilder
                        measures={selectableValues.concat(values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        fields={queryProvider.selectableFields}
                        onNewMeasure={m => {
                          const copy = [...selectableValues]
                          copy.push(measureToSelectableElement(m))
                          setSelectableValues(copy)
                        }}/>
              </div>
              <div className="col px-1 py-2">
                <HierarchicalMeasureBuilder
                        measures={selectableValues.concat(values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        onNewMeasure={m => {
                          const copy = [...selectableValues]
                          copy.push(measureToSelectableElement(m))
                          setSelectableValues(copy)
                        }}
                />
              </div>
              {props.elements}
            </div>
            {/* The pivot table */}
            {pivotQueryResult !== undefined ?
                    <PivotTable result={pivotQueryResult} formatters={props.formatters}/> : undefined}
          </div>
  )
}
