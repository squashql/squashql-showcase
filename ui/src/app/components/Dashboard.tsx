'use client'
import React, {useEffect, useState} from "react"
import AxisSelector, {AxisType, getElementString, SelectableElement} from "@/app/components/AxisSelector"
import {Field, Measure, PivotTableQueryResult} from "@squashql/squashql-js"
import {CompareWithGrandTotalAlongAncestors, PercentOfParentAlongAncestors, queryExecutor} from "@/app/lib/queries"
import dynamic from "next/dynamic"
import {QueryProvider} from "@/app/lib/queryProvider"
import HierarchicalMeasureBuilder from "@/app/components/HierarchicalMeasureBuilder"
import TimeComparisonMeasureBuilder from "@/app/components/TimeComparisonMeasureBuilder"
import CalculatedMeasureBuilder from "@/app/components/CalculatedMeasureBuilder"

// disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
const PivotTable = dynamic(() => import("@/app/components/PivotTable"), {ssr: false})
const FiltersSelector = dynamic(() => import("@/app/components/FiltersSelector"), {ssr: false})

export interface Formatter {
  field: string
  formatter: (v: any) => string
}

interface DashboardState {
  rows: SelectableElement[]
  columns: SelectableElement[]
  values: SelectableElement[]
  filters: SelectableElement[]
  selectableElements: SelectableElement[]
  selectableFilters: SelectableElement[]
  selectableValues: SelectableElement[]
  filtersValues: Map<Field, any[]>
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

function initialState(props: DashboardProps): DashboardState {
  const queryProvider = props.queryProvider
  return {
    columns: [],
    filters: [],
    filtersValues: new Map(),
    rows: [],
    selectableElements: queryProvider.selectableFields.map(fieldToSelectableElement),
    selectableFilters: queryProvider.selectableFields.map(fieldToSelectableElement),
    selectableValues: queryProvider.measures.map(measureToSelectableElement),
    values: []
  }
}

function computeInitialState(props: DashboardProps): DashboardState {
  if (typeof window !== "undefined") {
    const localStoreKey = window.location.href + "-" + props.title
    const data = window.localStorage.getItem(localStoreKey)
    if (data) {
      const state: DashboardState = JSON.parse(data, reviver)
      console.log(state) // FIXME delete
      return state
    }
  }
  return initialState(props)
}

function serializeMap(map: Map<any, any>): Map<string, any> {
  const m = new Map()
  for (const [key, value] of map) {
    m.set(JSON.stringify(key), value)
  }
  return m
}

function reviver(key: string, value: any) {
  if (key === "filtersValues") {
    const m: Map<Field, any> = new Map
    Object.entries(value).forEach(([k, v]) => m.set(JSON.parse(k), v))
    return m
  } else if (key === "type" && typeof value === "object") {
    if (value["class"] === "PercentOfParentAlongAncestors") {
      return new PercentOfParentAlongAncestors(value["alias"], value["underlying"], value["axis"])
    } else if (value["class"] === "CompareWithGrandTotalAlongAncestors") {
      return new CompareWithGrandTotalAlongAncestors(value["alias"], value["underlying"], value["axis"])
    }
  }

  return value
}

function replacer(key: string, value: any) {
  if (key === "filtersValues") {
    return Object.fromEntries(serializeMap(value))
  } else {
    return value
  }
}

export default function Dashboard(props: DashboardProps) {
  const queryProvider = props.queryProvider
  const [state, setState] = useState<DashboardState>(() => computeInitialState(props))
  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [minify, setMinify] = useState<boolean>(true)
  const [ptHierarchyType, setPtHierarchyType] = useState<HierarchyType>("tree")

  useEffect(() => {
    if (state) {
      const localStoreKey = window.location.href + "-" + props.title
      window.localStorage.setItem(localStoreKey, JSON.stringify(state, replacer))
    }
  }, [state])

  // TODO review this logic.
  function refresh(newElements: SelectableElement[], type: AxisType) {
    let r = state.rows
    let c = state.columns
    let v = state.values
    let fv = state.filtersValues
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
          if (newElements.map(e => getElementString(e.type)).indexOf(getElementString(key)) < 0) { // find the one that does not exist anymore
            copy.delete(key)
          }
        }
        setState((prevState) => {
          return {
            ...prevState,
            filtersValues: copy
          }
        })
        fv = copy
        break
    }

    return executeAndSetResult(r, c, v, fv, minify)
  }

  function refreshFromState() {
    return executeAndSetResult(state.rows, state.columns, state.values, state.filtersValues, minify)
  }

  function toggleMinify() {
    setMinify(!minify)
    executeAndSetResult(state.rows, state.columns, state.values, state.filtersValues, !minify)
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
    const copy = new Map(state.filtersValues)
    copy.set(field, filterValues)
    setState((prevState) => {
      return {
        ...prevState,
        filtersValues: copy
      }
    })
    executeAndSetResult(state.rows, state.columns, state.values, copy, minify)
  }

  function addNewMeasureToSelection(m: Measure) {
    const copy = state.values.slice()
    copy.push(measureToSelectableElement(m))
    setState((prevState) => {
      return {
        ...prevState,
        values: copy
      }
    })
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
                              elements={state.rows}
                              selectableElements={state.selectableElements}
                              elementsDispatcher={newElements => setState((prevState) => {
                                return {
                                  ...prevState,
                                  rows: newElements
                                }
                              })}
                              selectableElementsDispatcher={newSelectableElements => setState((prevState) => {
                                return {
                                  ...prevState,
                                  selectableElements: newSelectableElements
                                }
                              })}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={true}/>
                <hr/>
                <AxisSelector axisType={AxisType.COLUMNS}
                              elements={state.columns}
                              selectableElements={state.selectableElements}
                              elementsDispatcher={newElements => setState((prevState) => {
                                return {
                                  ...prevState,
                                  columns: newElements
                                }
                              })}
                              selectableElementsDispatcher={newSelectableElements => setState((prevState) => {
                                return {
                                  ...prevState,
                                  selectableElements: newSelectableElements
                                }
                              })}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={true}/>
                <hr/>
                <AxisSelector axisType={AxisType.VALUES}
                              elements={state.values}
                              selectableElements={state.selectableValues}
                              elementsDispatcher={newElements => setState((prevState) => {
                                return {
                                  ...prevState,
                                  values: newElements
                                }
                              })}
                              selectableElementsDispatcher={newSelectableValues => setState((prevState) => {
                                return {
                                  ...prevState,
                                  selectableValues: newSelectableValues
                                }
                              })}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={false}/>
                <hr/>
                <AxisSelector axisType={AxisType.FILTERS}
                              elements={state.filters}
                              selectableElements={state.selectableFilters}
                              elementsDispatcher={newElements => setState((prevState) => {
                                return {
                                  ...prevState,
                                  filters: newElements
                                }
                              })}
                              selectableElementsDispatcher={newSelectableFilters => setState((prevState) => {
                                return {
                                  ...prevState,
                                  selectableFilters: newSelectableFilters
                                }
                              })}
                              queryResultDispatcher={refresh}
                              showTotalsCheckBox={false}/>
                {state.filters?.map((element, index) => {
                  const field = element.type as Field
                  let preSelectedValues
                  state.filtersValues.forEach((v, k) => {
                    if (getElementString(k) === getElementString(field)) {
                      preSelectedValues = v
                    }
                  })
                  return (
                          <FiltersSelector key={index}
                                           table={queryProvider.table[0]} // FIXME it only handles 1 table for the time being
                                           field={(element.type as Field)}
                                           filters={state.filtersValues}
                                           preSelectedValues={preSelectedValues ?? []}
                                           onFilterChange={onFilterChange}/>)
                })}
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
                         onChange={() => setPtHierarchyType("tree")}/>
                  <label className="form-check-label" htmlFor="treeRadio">tree</label>
                </div>
                <div className="form-check form-check-inline mx-1">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="gridRadio"
                         value="grid" checked={ptHierarchyType === "grid"}
                         onChange={() => setPtHierarchyType("grid")}/>
                  <label className="form-check-label" htmlFor="gridRadio">grid</label>
                </div>
              </div>

              <div className="col px-1">
                <CalculatedMeasureBuilder
                        measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        onNewMeasure={addNewMeasureToSelection}/>
              </div>
              <div className="col px-1">
                <TimeComparisonMeasureBuilder
                        measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        fields={queryProvider.selectableFields}
                        onNewMeasure={addNewMeasureToSelection}/>
              </div>
              <div className="col px-1">
                <HierarchicalMeasureBuilder
                        measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
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
