'use client'
import {PivotTable} from "@/app/PivotTable";
import {PivotTableQueryResult} from "@squashql/squashql-js/dist/querier";
import {useState} from "react";
import AxisSelector, {AxisType, SelectedType} from "@/app/AxisSelector";
import {Measure, TableField} from "@squashql/squashql-js";
import {queryExecutor, queryProvider} from "@/app/queries";

export default function Page() {
  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [rows, setRows] = useState<SelectedType[]>([])
  const [columns, setColumns] = useState<SelectedType[]>([])
  const [selectableElements, setSelectableElements] = useState<SelectedType[]>(queryProvider.selectableFields)
  const [selectableValues, setSelectableValues] = useState<SelectedType[]>(queryProvider.measures)
  const [values, setValues] = useState<SelectedType[]>([])

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
    return executeAndSetResult(r, c, v)
  }

  function refreshFromState() {
    return executeAndSetResult(rows, columns, values)
  }

  function executeAndSetResult(rows: SelectedType[], columns: SelectedType[], values: SelectedType[]) {
    return queryExecutor.executePivotQuery(
            rows.map(e => e as TableField),
            columns.map(e => e as TableField),
            values.map(e => e as Measure))
            .then(r => setPivotQueryResult(r as PivotTableQueryResult))
  }

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
            <button className="btn btn-ligth" onClick={refreshFromState}>Refresh</button>
            {pivotQueryResult !== undefined ? <PivotTable result={pivotQueryResult}/> : undefined}
          </div>
  )
}
