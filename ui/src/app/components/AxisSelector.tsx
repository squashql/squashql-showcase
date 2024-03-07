import {ChangeEvent, Dispatch, SetStateAction} from "react"
import {Field, Measure, TableField, AliasedField} from "@squashql/squashql-js"

export enum AxisType {
  ROWS,
  COLUMNS,
  VALUES,
  FILTERS,
}

export interface SelectableElement {
  type: Field | Measure,
  showTotals: boolean
}

export type SelectablePeriod = "Year" | "Month"

interface AxisSelectorProps {
  axisType: AxisType,
  elements: SelectableElement[],
  selectableElements: SelectableElement[],
  elementsDispatcher: Dispatch<SetStateAction<SelectableElement[]>>
  selectableElementsDispatcher: Dispatch<SetStateAction<SelectableElement[]>>
  queryResultDispatcher: (newElements: SelectableElement[], type: AxisType) => void
  showTotalsCheckBox: boolean
}

function getAxisName(axisType: AxisType): string {
  switch (axisType) {
    case AxisType.ROWS:
      return "Rows"
    case AxisType.COLUMNS:
      return "Columns"
    case AxisType.VALUES:
      return "Measures"
    case AxisType.FILTERS:
      return "Filters"
  }
}

function isMeasure(element: any): element is Measure {
  return 'expression' in element
}

function isTableField(element: any): element is TableField {
  return element.fullName
}

function isAliasedField(element: any): element is AliasedField {
  return element
}

function isSelectableElement(element: any): element is SelectableElement {
  return 'type' in element && 'showTotals' in element
}

function getFieldOrMeasureString(element: Field | Measure) {
  if (isMeasure(element)) {
    return element.alias
  } else if (isTableField(element)) {
    return element.fullName
  } else if (isAliasedField(element)) {
    return element.alias
  } else {
    throw new Error("Unexpected type " + element)
  }
}

export function getElementString(element: SelectableElement | SelectablePeriod | string): string {
  if (typeof element === "string") {
    return element
  } else if (isSelectableElement(element)) {
    return getFieldOrMeasureString(element.type)
  } else {
    return getFieldOrMeasureString(element)
  }
}

function onChangeSelection(event: ChangeEvent<HTMLSelectElement>, props: AxisSelectorProps) {
  const selectableElements = props.selectableElements
  const selectedElements = props.elements
  const index = selectableElements.map(v => getElementString(v)).indexOf(event.target.value)
  const nextSelectableElements = selectableElements.slice()
  selectedElements.push(nextSelectableElements[index])
  nextSelectableElements.splice(index, 1)
  props.elementsDispatcher(selectedElements)
  props.selectableElementsDispatcher(nextSelectableElements)
  props.queryResultDispatcher(selectedElements, props.axisType)
}

function onClickSelectedElement(element: string, props: AxisSelectorProps) {
  const selectableElements = props.selectableElements
  const selectedElements = props.elements
  const index = selectedElements.map(v => getElementString(v)).indexOf(element)
  const nextSelectedElements = selectedElements.slice()
  const nextSelectableElements = selectableElements.slice()
  nextSelectableElements.push(nextSelectedElements[index])
  nextSelectedElements.splice(index, 1)
  props.elementsDispatcher(nextSelectedElements)
  props.selectableElementsDispatcher(nextSelectableElements)
  props.queryResultDispatcher(nextSelectedElements, props.axisType)
}

function onToggleShowTotals(element: string, props: AxisSelectorProps) {
  const selectedElements = props.elements
  const index = selectedElements.map(v => getElementString(v)).indexOf(element)
  const nextSelectedElements = selectedElements.slice()
  nextSelectedElements[index] = {
    type: selectedElements[index].type,
    showTotals: !selectedElements[index].showTotals
  }
  props.elementsDispatcher(nextSelectedElements)
  props.queryResultDispatcher(nextSelectedElements, props.axisType)
}

export default function AxisSelector(props: AxisSelectorProps) {
  return (
          <div>
            <div className="row row-cols-auto">
              <div className="col">
                {getAxisName(props.axisType)}:
              </div>
              {props.elements?.map((element, index) => (
                      <div key={index} className="col ps-0">
                      <span key={index} className="badge text-bg-secondary" style={{cursor: "pointer"}}
                            onClick={() => onClickSelectedElement(getElementString(element), props)}>{getElementString(element)}
                      </span>
                        {props.showTotalsCheckBox && (
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" value="" id="showTotals"
                                         checked={element.showTotals}
                                         onChange={() => onToggleShowTotals(getElementString(element), props)}/>
                                  <label className="form-check-label" htmlFor="showTotals">
                                    Show totals
                                  </label>
                                </div>)}
                      </div>
              ))}
            </div>
            <div className="w-25">
              <select value={'DEFAULT'}
                      className="form-select form-select-sm"
                      onChange={event => onChangeSelection(event, props)}>
                <option value="DEFAULT" disabled>Select option</option>
                {props.selectableElements
                        .map((element, index) =>
                                <option key={index}
                                        value={getElementString(element)}>{getElementString(element)}</option>)}
              </select>
            </div>
          </div>
  )
}
