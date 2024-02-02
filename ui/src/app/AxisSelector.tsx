import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {Measure, TableField} from "@squashql/squashql-js";

export enum AxisType {
  ROWS,
  COLUMNS,
  VALUES
}

export type SelectedType = TableField | Measure

interface AxisSelectorProps {
  type: AxisType,
  elements: SelectedType[],
  selectableElements: SelectedType[],
  elementsDispatcher: Dispatch<SetStateAction<SelectedType[]>>
  selectableElementsDispatcher: Dispatch<SetStateAction<SelectedType[]>>
  queryResultDispatcher: (newElements: SelectedType[], type: AxisType) => void
}

function getAxisName(axisType: AxisType): string {
  switch (axisType) {
    case AxisType.ROWS:
      return "Rows"
    case AxisType.COLUMNS:
      return "Columns"
    case AxisType.VALUES:
      return "Measures"
  }
}

function isTableField(object: any): object is TableField {
  return 'fullName' in object
}

function getElementString(element: SelectedType): string {
  return isTableField(element) ? element.fullName : element.alias
}

function onChangeSelection(event: ChangeEvent<HTMLSelectElement>, props: AxisSelectorProps) {
  const axisType = props.type
  const selectableElements = props.selectableElements
  const selectedElements = props.elements
  const index = selectableElements.map(v => getElementString(v)).indexOf(event.target.value)
  const nextSelectableElements = selectableElements.slice()
  selectedElements.push(nextSelectableElements[index])
  nextSelectableElements.splice(index, 1)
  props.elementsDispatcher(selectedElements)
  props.selectableElementsDispatcher(nextSelectableElements)
  props.queryResultDispatcher(selectedElements, axisType)
}

function onClickSelectedElement(element: string, props: AxisSelectorProps) {
  const axisType = props.type
  const selectableElements = props.selectableElements
  const selectedElements = props.elements
  const index = selectedElements.map(v => getElementString(v)).indexOf(element)
  const nextSelectedElements = selectedElements.slice()
  const nextSelectableElements = selectableElements.slice()
  nextSelectableElements.push(nextSelectedElements[index])
  nextSelectedElements.splice(index, 1)
  props.elementsDispatcher(nextSelectedElements)
  props.selectableElementsDispatcher(nextSelectableElements)
  props.queryResultDispatcher(nextSelectedElements, axisType)
}

export default function AxisSelector(props: AxisSelectorProps) {
  return (
          <div>
            {getAxisName(props.type)}:
            {props.elements?.map((element, index) => (
                    <span key={index} className="ms-1 mb-1 badge rounded-pill text-bg-dark" style={{cursor: "pointer"}}
                          onClick={() => onClickSelectedElement(getElementString(element), props)}>{getElementString(element)}</span>))}
            <div className="w-25">
              <select value={'DEFAULT'}
                      className="form-select form-select-sm"
                      onChange={event => onChangeSelection(event, props)}>
                <option value="DEFAULT" disabled>Select option</option>
                {props.selectableElements.map((element, index) => <option key={index}
                                                                          value={getElementString(element)}>{getElementString(element)}</option>)}
              </select>
            </div>
          </div>
  )
}
