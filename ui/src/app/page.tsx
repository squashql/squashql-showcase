'use client'
import {PivotTable} from "@/app/PivotTable";
import {PivotTableQueryResult} from "@squashql/squashql-js/dist/querier";
import {useState} from "react";
import AxisSelector, {AxisType, SelectedType} from "@/app/AxisSelector";
import {Measure, TableField} from "@squashql/squashql-js";
import {initialSelectElements} from "@/app/queries";

export default function Page() {
  const testResult: PivotTableQueryResult = {
    "queryResult": {
      "table": {
        "columns": ["product", "region", "month", "sales", "myMeasure"],
        "rows": [
          ["Grand Total", "Grand Total", "Grand Total", 16200.0, 123],
          ["Grand Total", "Grand Total", "Jan", 6700.0],
          ["Grand Total", "Grand Total", "Feb", 5150.0, 123],
          ["Grand Total", "Grand Total", "Mar", 4350.0],
          ["ProductA", "Total", "Grand Total", 6450.0, 123],
          ["ProductA", "Total", "Jan", 2200.0],
          ["ProductA", "Total", "Feb", 2000.0, 123],
          ["ProductA", "Total", "Mar", 2250.0],
          ["ProductA", "North", "Grand Total", 2850.0, 123],
          ["ProductA", "North", "Jan", 1000.0],
          ["ProductA", "North", "Feb", 900.0, 123],
          ["ProductA", "North", "Mar", 950.0],
          ["ProductA", "South", "Grand Total", 3600.0, 123],
          ["ProductA", "South", "Jan", 1200.0],
          ["ProductA", "South", "Feb", 1100.0, 123],
          ["ProductA", "South", "Mar", 1300.0],
          ["ProductB", "Total", "Grand Total", 6450.0, 123],
          ["ProductB", "Total", "Jan", 2300.0],
          ["ProductB", "Total", "Feb", 2050.0, 123],
          ["ProductB", "Total", "Mar", 2100.0],
          ["ProductB", "North", "Grand Total", 2250.0, 123],
          ["ProductB", "North", "Jan", 800.0],
          ["ProductB", "North", "Feb", 750.0, 123],
          ["ProductB", "North", "Mar", 700.0],
          ["ProductB", "South", "Grand Total", 4200.0, 123],
          ["ProductB", "South", "Jan", 1500.0],
          ["ProductB", "South", "Feb", 1300.0, 123],
          ["ProductB", "South", "Mar", 1400.0],
          ["ProductC", "Total", "Grand Total", 3300.0, 123],
          ["ProductC", "Total", "Jan", 2200.0],
          ["ProductC", "Total", "Feb", 1100.0, 123],
          ["ProductC", "North", "Grand Total", 2300.0, 123],
          ["ProductC", "North", "Jan", 1200.0],
          ["ProductC", "North", "Feb", 1100.0, 123],
          ["ProductC", "South", "Grand Total", 1000.0, 123],
          ["ProductC", "South", "Jan", 1000.0]
        ]
      },
      "metadata": [{
        "name": "product",
        "expression": "product",
        "type": "java.lang.String"
      }, {
        "name": "region",
        "expression": "region",
        "type": "java.lang.String"
      }, {
        "name": "month",
        "expression": "month",
        "type": "java.lang.String"
      }, {
        "name": "sales",
        "expression": "sales",
        "type": "double"
      }],
      "debug": null
    },
    "rows": ["product", "region"],
    "columns": ["month"],
    "values": ["sales", "myMeasure"]
  }

  const [pivotQueryResult, setPivotQueryResult] = useState<PivotTableQueryResult>()
  const [rows, setRows] = useState<SelectedType[]>([])
  const [columns, setColumns] = useState<SelectedType[]>([])
  const [selectableElements, setSelectableElements] = useState<SelectedType[]>(initialSelectElements)
  const [values, setValues] = useState<Measure[]>([])

  let content;
  if (pivotQueryResult !== undefined) {
    content = <PivotTable result={pivotQueryResult}/>
  } else {
    content = <div>empty</div>
  }

  return (
          <div>
            <h1>Pivot table</h1>
            <AxisSelector type={AxisType.ROWS}
                          elements={rows}
                          selectableElements={selectableElements}
                          elementsDispatcher={setRows}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={setPivotQueryResult}/>
            <AxisSelector type={AxisType.COLUMNS}
                          elements={columns}
                          selectableElements={selectableElements}
                          elementsDispatcher={setColumns}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={setPivotQueryResult}/>
            <AxisSelector type={AxisType.VALUES}
                          elements={values}
                          selectableElements={[]}
                          elementsDispatcher={setRows}
                          selectableElementsDispatcher={setSelectableElements}
                          queryResultDispatcher={setPivotQueryResult}/>
            <button onClick={() => console.log("hello")}>Refresh</button>
            {content}
          </div>
  )
}
