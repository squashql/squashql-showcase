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

// disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
const PivotTable = dynamic(() => import("@/app/components/PivotTable"), {ssr: false})
const FiltersSelector = dynamic(() => import("@/app/components/FiltersSelector"), {ssr: false})

export interface DashboardProps {
  title: string
  queryProvider: QueryProvider
  formatters?: PivotTableCellFormatter[]
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
          props.queryProvider.measures.map(measureToSelectableElement)), 8)

  useEffect(() => {
    refreshFromState().then(() => {
      // FIXME
      console.log(state)
      saveCurrentState(storageKey, state)
    })
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
              <div className="col">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb my-2">
                    <li className="breadcrumb-item"><a href="../">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{props.title}</li>
                  </ol>
                </nav>
              </div>

              <div className="col my-1">
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                  <button type="button" className="btn btn-outline-primary" title="Undo" disabled={!canUndo}
                          onClick={undo}>
                    <i className="bi bi-arrow-left-circle"></i>
                  </button>
                  {/* Refresh button */}
                  <button type="button" className="btn btn-outline-primary" title="Re-execute"
                          onClick={refreshFromState}>
                    <i className="bi bi-arrow-repeat"></i></button>
                  <button type="button" className="btn btn-outline-primary" title="Redo" disabled={!canRedo}
                          onClick={redo}>
                    <i className="bi bi-arrow-right-circle"></i>
                  </button>
                  <button type="button" className="btn btn-outline-primary" onClick={clearHistory}>Clear cache</button>
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

            {/* Refresh button + Minify option + other elements */}
            <div className="row row-cols-auto">
              <div className="col px-1">
                <button className="btn btn-sm btn-dark" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                  Edit
                </button>
              </div>
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

              <div className="col px-1">
                <FormatterBuilder
                        measures={state.selectableValues.concat(state.values).map(m => (m.type as Measure)).sort((a: Measure, b: Measure) => a.alias.localeCompare(b.alias))}
                        onNewMeasureFormatter={addFormatterToMeasure}/>
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
            <div className="row pt-2">
              {pivotQueryResult !== undefined ?
                      <PivotTable result={pivotQueryResult}
                                  hierarchyType={ptHierarchyType}
                                  formatters={state.formatters.concat(props.formatters ? props.formatters : [])}/> : undefined}
            </div>
          </div>
  )
}
