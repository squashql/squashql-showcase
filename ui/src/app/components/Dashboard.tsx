'use client'
import React, {useEffect, useState} from "react"
import AxisSelector, {AxisType, getElementString, SelectableElement} from "@/app/components/AxisSelector"
import {Field, Measure, PivotTableQueryResult} from "@squashql/squashql-js"
import {PartialMeasure, queryExecutor} from "@/app/lib/queries"
import dynamic from "next/dynamic"
import {QueryProvider} from "@/app/lib/queryProvider"
import HierarchicalMeasureBuilder from "@/app/components/HierarchicalMeasureBuilder"
import TimeComparisonMeasureBuilder from "@/app/components/TimeComparisonMeasureBuilder"
import CalculatedMeasureBuilder from "@/app/components/CalculatedMeasureBuilder"
import FormatterBuilder from "@/app/components/FormatterBuilder"
import {
  computeInitialState,
  fieldToSelectableElement,
  measureToSelectableElement,
  PivotTableCellFormatter,
  saveCurrentState,
  useUndoRedo
} from "@/app/lib/dashboard"
import {Formatter} from "@/app/lib/formatters"
import ColumnComparisonMeasureBuilder from "@/app/components/ColumnComparisonMeasureBuilder"

// disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
const PivotTable = dynamic(() => import("@/app/components/PivotTable"), {ssr: false})
const FiltersSelector = dynamic(() => import("@/app/components/FiltersSelector"), {ssr: false})

export interface DashboardProps {
  title: string
  queryProvider: QueryProvider
  elements?: React.JSX.Element[]
}

export type HierarchyType = 'grid' | 'tree' | 'customTree'

export default function Dashboard(props: DashboardProps) {
  const storageKey = `state#${props.title.toLowerCase()}`
  const queryProvider = props.queryProvider
  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [minify, setMinify] = useState<boolean>(true)
  const [ptHierarchyType, setPtHierarchyType] = useState<HierarchyType>("tree")

  const {state, setState, undo, redo, canUndo, canRedo} = useUndoRedo(computeInitialState(storageKey,
          props.queryProvider.selectableFields.map(fieldToSelectableElement),
          props.queryProvider.selectableFields.map(fieldToSelectableElement),
          props.queryProvider.measures.map(measureToSelectableElement),
          props.queryProvider.formatters), 8)

  useEffect(() => {
    refreshFromState().then(() => saveCurrentState(storageKey, state))
  }, [state])

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

  function addNewMeasureToSelection(m: Measure | PartialMeasure) {
    const copy = state.values.slice()
    copy.push(measureToSelectableElement(m))
    setState((prevState) => {
      return {
        ...prevState,
        values: copy
      }
    })
  }

  function addFormatterToMeasure(m: Measure | PartialMeasure, formatter: Formatter) {
    const copy = state.formatters ? state.formatters.slice() : []
    const field = getElementString(m)
    const index = copy.map(f => f.field).indexOf(field)
    if (index >= 0) {
      copy.splice(index, 1)
    }
    copy.push(new PivotTableCellFormatter(field, formatter))
    setState((prevState) => {
      return {
        ...prevState,
        formatters: copy
      }
    })
  }

  function clearHistory() {
    window.localStorage.removeItem(storageKey)
  }

  return (
          <div className="container-fluid">
            <div className="row row-cols-auto">
              <div className="col px-0 mx-1 my-1">
                <button className="btn btn-sm btn-secondary" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>

              <div className="col px-0 mx-1 my-1">
                <div className="dropdown">
                  <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                          aria-expanded="false">
                    Edit
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className={`dropdown-item ${!canUndo ? "disabled" : ""}`} href="#" onClick={undo}>Undo</a>
                    </li>
                    <li><a className={`dropdown-item ${!canRedo ? "disabled" : ""}`} href="#" onClick={redo}>Redo</a>
                    </li>
                    <li><a className="dropdown-item" href="#" onClick={clearHistory}>Clear state</a></li>
                    <li>
                      <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#" onClick={refreshFromState}>Re-execute</a></li>
                  </ul>
                </div>
              </div>

              <div className="col px-0 mx-1 my-1">
                <div className="dropdown">
                  <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                          aria-expanded="false">
                    Data
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#" data-bs-toggle="modal"
                           data-bs-target="#formatmeasModal">Format</a></li>
                    <li>
                      <hr className="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#calcmeasModal">Calculated
                      measure</a></li>
                    <li><a className="dropdown-item" href="#" data-bs-toggle="modal"
                           data-bs-target="#timeperiodcompModal">Time period comparison</a></li>
                    <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#hiercompModal">Hierarchical
                      comparison</a></li>
                    <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#columncompModal">Dimension
                      comparison</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Edit Pivot Table */}
            <div className="offcanvas offcanvas-end" data-bs-scroll="true"
                 data-bs-backdrop="false" tabIndex={-1}
                 id="offcanvasRight"
                 aria-labelledby="offcanvasRightLabel">
              <div className="offcanvas-header pb-1">
                <h5 className="my-0" id="offcanvasRightLabel">Pivot Table Editor</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <AxisSelector axisType={AxisType.ROWS}
                              selectedElements={state.rows}
                              selectableElements={state.selectableElements}
                              elementsDispatcher={(newSelectedElements, newSelectableElements) => setState((prevState) => {
                                return {
                                  ...prevState,
                                  rows: newSelectedElements,
                                  selectableElements: newSelectableElements
                                }
                              })}
                              showTotalsCheckBox={true}/>
                <hr/>
                <AxisSelector axisType={AxisType.COLUMNS}
                              selectedElements={state.columns}
                              selectableElements={state.selectableElements}
                              elementsDispatcher={(newSelectedElements, newSelectableElements) => setState((prevState) => {
                                return {
                                  ...prevState,
                                  columns: newSelectedElements,
                                  selectableElements: newSelectableElements
                                }
                              })}
                              showTotalsCheckBox={true}/>
                <hr/>
                <AxisSelector axisType={AxisType.VALUES}
                              selectedElements={state.values}
                              selectableElements={state.selectableValues}
                              elementsDispatcher={(newSelectedElements, newSelectableElements) => setState((prevState) => {
                                return {
                                  ...prevState,
                                  values: newSelectedElements,
                                  selectableValues: newSelectableElements
                                }
                              })}
                              showTotalsCheckBox={false}/>
                <hr/>
                <AxisSelector axisType={AxisType.FILTERS}
                              selectedElements={state.filters}
                              selectableElements={state.selectableFilters}
                              elementsDispatcher={(newSelectedElements, newSelectableElements) => setState((prevState) => {
                                // Special case for the filters to handle elements being removed
                                const copy = new Map(state.filtersValues)
                                for (let [key, __] of copy) {
                                  if (newSelectedElements.map(e => e.type).indexOf(key) < 0 && copy.delete(key)) { // find the one that does not exist anymore
                                    break
                                  }
                                }
                                return {
                                  ...prevState,
                                  filters: newSelectedElements,
                                  selectableFilters: newSelectableElements,
                                  filtersValues: copy
                                }
                              })}
                              showTotalsCheckBox={false}/>
                {state.filters?.map((element, index) => {
                  const field = element.type as Field
                  const preSelectedValues = state.filtersValues.get(field)
                  return (
                          <FiltersSelector key={index}
                                           table={queryProvider.table[0]} // FIXME it only handles 1 table for the time being
                                           field={field}
                                           filters={state.filtersValues}
                                           preSelectedValues={preSelectedValues ?? []}
                                           onFilterChange={onFilterChange}/>)
                })}
              </div>
            </div>

            {/* Minify option + tree/grid + other elements */}
            <div className="row row-cols-auto">
              <div className="col px-1">
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

              <FormatterBuilder
                      measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                      onNewMeasureFormatter={addFormatterToMeasure}/>
              <CalculatedMeasureBuilder
                      measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                      onNewMeasure={addNewMeasureToSelection}/>
              <TimeComparisonMeasureBuilder
                      measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                      fields={queryProvider.selectableFields}
                      onNewMeasure={addNewMeasureToSelection}/>
              <HierarchicalMeasureBuilder
                      measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                      onNewMeasure={addNewMeasureToSelection}
              />
              <ColumnComparisonMeasureBuilder
                      fields={queryProvider.selectableFields}
                      measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                      onNewMeasure={addNewMeasureToSelection}
              />
              {props.elements}
            </div>

            {/* The pivot table */}
            <div className="row pt-2">
              {pivotQueryResult !== undefined ?
                      <PivotTable result={pivotQueryResult}
                                  hierarchyType={ptHierarchyType}
                                  formatters={state.formatters}/> : undefined}
            </div>
          </div>
  )
}
