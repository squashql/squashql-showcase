'use client'
import React, {useState} from "react"
import AxisSelector, {AxisType, SelectedType} from "@/app/components/AxisSelector"
import {Field, Measure, PivotTableQueryResult, TableField} from "@squashql/squashql-js"
import {queryExecutor} from "@/app/lib/queries"
import dynamic from "next/dynamic"
import {QueryProvider} from "@/app/lib/queryProvider"
import {spending} from "@/app/lib/tables"

// FIXME should not be hardcoded

interface DashboardProps {
  title: string
  queryProvider: QueryProvider,
  elements?: React.JSX.Element[]
}

// disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
const PivotTable = dynamic(() => import("@/app/components/PivotTable"), {ssr: false})
const FiltersSelector = dynamic(() => import("@/app/components/FiltersSelector"), {ssr: false})

export default function Dashboard(props: DashboardProps) {

  const queryProvider = props.queryProvider
  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [rows, setRows] = useState<SelectedType[]>([])
  const [columns, setColumns] = useState<SelectedType[]>([])
  const [filters, setFilters] = useState<SelectedType[]>([])
  const [selectableElements, setSelectableElements] = useState<SelectedType[]>(queryProvider.selectableFields)
  const [selectableFilters, setSelectableFilters] = useState<SelectedType[]>(queryProvider.selectableFields)
  const [selectableValues, setSelectableValues] = useState<SelectedType[]>(queryProvider.measures)
  const [values, setValues] = useState<SelectedType[]>([])
  const [minify, setMinify] = useState<boolean>(true)
  const [filtersValues, setFiltersValues] = useState<Map<Field, any[]>>(new Map())

  function refresh(newElements: SelectedType[], type: AxisType) {
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
        for (let [key, val] of copy) {
          if (newElements.indexOf(key) < 0) {
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

  function executeAndSetResult(rows: SelectedType[], columns: SelectedType[], values: SelectedType[], filters: Map<Field, any[]>, minify: boolean) {
    return queryExecutor.executePivotQuery(
            queryProvider,
            rows.map(e => e as TableField),
            columns.map(e => e as TableField),
            values.map(e => e as Measure),
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
          <div className="ms-1">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="../">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">{props.title}</li>
              </ol>
            </nav>
            <AxisSelector type={AxisType.ROWS}
                          elements={rows}
                          selectableElements={selectableElements}
                          elementsDispatcher={setRows}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={refresh}/>
            <AxisSelector type={AxisType.COLUMNS}
                          elements={columns}
                          selectableElements={selectableElements}
                          elementsDispatcher={setColumns}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={refresh}/>
            <AxisSelector type={AxisType.VALUES}
                          elements={values}
                          selectableElements={selectableValues}
                          elementsDispatcher={setValues}
                          selectableElementsDispatcher={setSelectableValues}
                          queryResultDispatcher={refresh}/>
            <AxisSelector type={AxisType.FILTERS}
                          elements={filters}
                          selectableElements={selectableFilters}
                          elementsDispatcher={setFilters}
                          selectableElementsDispatcher={setSelectableFilters}
                          queryResultDispatcher={refresh}/>
            <div>
              {filters?.map((element, index) => (
                      <FiltersSelector key={JSON.stringify(element)}
                                       table={spending}
                                       field={(element as Field)}
                                       filters={filtersValues}
                                       onFilterChange={onFilterChange}/>))}
            </div>
            <div className="row row-cols-auto">
              <div className="col">
                <button className="btn btn-ligth" onClick={refreshFromState}>Refresh</button>
              </div>
              <div className="col py-2">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={minify}
                       onChange={toggleMinify}/>
                <label className="form-check-label px-1" htmlFor="flexCheckChecked">
                  Minify
                </label>
              </div>
              {props.elements}
            </div>
            {pivotQueryResult !== undefined ? <PivotTable result={pivotQueryResult}/> : undefined}
          </div>
  )
}
