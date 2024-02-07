'use client'
import {useState} from "react"
import AxisSelector, {AxisType, SelectedType} from "@/app/AxisSelector"
import {Measure, PivotTableQueryResult, TableField} from "@squashql/squashql-js"
import {queryExecutor, queryProvider} from "@/app/queries"
import dynamic from "next/dynamic";

export default function Page() {

  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [rows, setRows] = useState<SelectedType[]>([])
  const [columns, setColumns] = useState<SelectedType[]>([])
  const [selectableElements, setSelectableElements] = useState<SelectedType[]>(queryProvider.selectableFields)
  const [selectableValues, setSelectableValues] = useState<SelectedType[]>(queryProvider.measures)
  const [values, setValues] = useState<SelectedType[]>([])
  const [minify, setMinify] = useState<boolean>(true)

  function refresh(newElements: SelectedType[], type: AxisType) {
    let r = rows
    let c = columns
    let v = values
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
    }
    return executeAndSetResult(r, c, v, minify)
  }

  function refreshFromState() {
    return executeAndSetResult(rows, columns, values, minify)
  }

  function toggleMinify() {
    setMinify(!minify)
    executeAndSetResult(rows, columns, values, !minify)
  }

  function executeAndSetResult(rows: SelectedType[], columns: SelectedType[], values: SelectedType[], minify: boolean) {
    return queryExecutor.executePivotQuery(
            rows.map(e => e as TableField),
            columns.map(e => e as TableField),
            values.map(e => e as Measure),
            minify)
            .then(r => setPivotQueryResult(r as PivotTableQueryResult))
  }

  // disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
  const PivotTable = dynamic(() => import("./PivotTable"), {ssr: false});

  return (
          <div className="ms-1">
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
            </div>
            {pivotQueryResult !== undefined ? <PivotTable result={pivotQueryResult}/> : undefined}
          </div>
  )
}
