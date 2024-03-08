'use client'
import React, {useState} from "react"
import AxisSelector, {AxisType, SelectableElement} from "@/app/components/AxisSelector"
import {Field, Measure, PivotTableQueryResult} from "@squashql/squashql-js"
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

export type HierarchyType = 'grid' | 'tree' | 'customTree'

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
  const [ptHierarchyType, setPtHierarchyType] = useState<HierarchyType>("tree")

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

  function onChangePivotTableMode(mode: HierarchyType) {
    setPtHierarchyType(mode)
  }

  function addNewMeasureToSelection(m: Measure) {
    const copy = values.slice()
    copy.push(measureToSelectableElement(m))
    setValues(copy)
    refresh(copy, AxisType.VALUES)
  }

  return (
          <div className="container-fluid">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb my-2">
                <li className="breadcrumb-item"><a href="../">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">{props.title}</li>
              </ol>
            </nav>

            {/* Edit Pivot Table */}
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1}
                 id="offcanvasRight"
                 aria-labelledby="offcanvasRightLabel">
              <div className="offcanvas-header pb-1">
                <h5 className="my-0" id="offcanvasRightLabel">Pivot Table Editor</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <AxisSelector axisType={AxisType.ROWS}
                              elements={rows}
                              selectableElements={selectableElements}
                              elementsDispatcher={setRows}
                              selectableElementsDispatcher={setSelectableElements}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={true}/>
                <hr/>
                <AxisSelector axisType={AxisType.COLUMNS}
                              elements={columns}
                              selectableElements={selectableElements}
                              elementsDispatcher={setColumns}
                              selectableElementsDispatcher={setSelectableElements}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={true}/>
                <hr/>
                <AxisSelector axisType={AxisType.VALUES}
                              elements={values}
                              selectableElements={selectableValues}
                              elementsDispatcher={setValues}
                              selectableElementsDispatcher={setSelectableValues}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={false}/>
                <hr/>
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
              </div>
            </div>

            {/* Refresh button + Minify option + other elements */}
            <div className="row row-cols-auto">
              <div className="col px-1">
                <button className="btn btn-sm btn-dark" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Edit
                </button>
              </div>
              <div className="col px-1">
                <button type="button" className="btn btn-sm btn-light" onClick={refreshFromState}>Refresh</button>
              </div>
              <div className="col px-0">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={minify}
                       onChange={toggleMinify}/>
                <label className="form-check-label px-1" htmlFor="flexCheckChecked">Minify</label>
              </div>

              {/* Tree | Grid mode */}
              <div className="col px-0">
                <div className="form-check form-check-inline mx-1">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="treeRadio"
                         value="tree" checked={ptHierarchyType === "tree"}
                         onChange={() => onChangePivotTableMode("tree")}/>
                  <label className="form-check-label" htmlFor="treeRadio">tree</label>
                </div>
                <div className="form-check form-check-inline mx-1">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="gridRadio"
                         value="grid" checked={ptHierarchyType === "grid"}
                         onChange={() => onChangePivotTableMode("grid")}/>
                  <label className="form-check-label" htmlFor="gridRadio">grid</label>
                </div>
              </div>

              <div className="col px-1">
                <CalculatedMeasureBuilder
                        measures={selectableValues.concat(values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        onNewMeasure={addNewMeasureToSelection}/>
              </div>
              <div className="col px-1">
                <TimeComparisonMeasureBuilder
                        measures={selectableValues.concat(values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        fields={queryProvider.selectableFields}
                        onNewMeasure={addNewMeasureToSelection}/>
              </div>
              <div className="col px-1">
                <HierarchicalMeasureBuilder
                        measures={selectableValues.concat(values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        onNewMeasure={addNewMeasureToSelection}
                />
              </div>
              {props.elements}
            </div>

            {/* The pivot table */}
            <div className="row">
              {pivotQueryResult !== undefined ?
                      <PivotTable result={pivotQueryResult}
                                  hierarchyType={ptHierarchyType}
                                  formatters={props.formatters}/> : undefined}
            </div>
          </div>
  )
}
