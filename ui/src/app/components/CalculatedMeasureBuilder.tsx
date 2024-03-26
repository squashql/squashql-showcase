import React, {useState} from "react"
import {Measure, BinaryOperator, BinaryOperationMeasure} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import FloatingInputText from "@/app/components/FloatingInputText"
import {PartialMeasure} from "@/app/lib/queries"

interface CalculatedMeasureBuilderProps {
  measures: Measure[]
  onNewMeasure: (m: Measure | PartialMeasure) => void
}

interface CalculatedMeasureBuilderState {
  leftOperand?: Measure
  rightOperand?: Measure
  alias: string | ""
  operator?: BinaryOperator
}

const initialState = {
  alias: "",
}

export default function CalculatedMeasureBuilder(props: CalculatedMeasureBuilderProps) {
  const [state, setState] = useState<CalculatedMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    if (state.leftOperand !== undefined && state.rightOperand !== undefined && state.operator !== undefined && state.alias !== "") {
      const measure = new BinaryOperationMeasure(state.alias, state.operator, state.leftOperand, state.rightOperand)
      props.onNewMeasure(measure)
      setState(initialState) // Clear everything
    }
  }

  function canBuildMeasure(): boolean {
    return state.leftOperand !== undefined && state.rightOperand !== undefined && state.operator !== undefined && state.alias !== ""
  }

  return (
          <div>
            {/*The modal is displayed via a button in the menu list*/}
            {/*<button type="button" className="btn btn-sm btn-light" data-bs-toggle="modal"*/}
            {/*        data-bs-target="#calcmeasModal">*/}
            {/*  Calculated measure*/}
            {/*</button>*/}

            <div className="modal fade" id="calcmeasModal"
                 tabIndex={-1}
                 aria-labelledby="calcmeasModalLabel"
                 aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="calcmeasModalLabel">Calculated measure</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">

                    {/*left operand measure*/}
                    <div className="pb-1">
                      <FloatingSelect label={"left operand"}
                                      value={state.leftOperand?.alias}
                                      fields={props.measures}
                                      onChange={event => {
                                        const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                                        const underlyingMeasure = props.measures[index]
                                        setState((prevState) => {
                                          return {
                                            ...prevState,
                                            leftOperand: underlyingMeasure,
                                          }
                                        })
                                      }}/>
                    </div>

                    {/*operator*/}
                    <div className="pb-1">
                      <FloatingSelect label={"type"}
                                      value={state.operator}
                                      fields={Object.keys(BinaryOperator)}
                                      onChange={event => {
                                        const index = Object.keys(BinaryOperator).map(v => getElementString(v)).indexOf(event.target.value)
                                        const operator = Object.values(BinaryOperator)[index]
                                        setState((prevState) => {
                                          return {
                                            ...prevState,
                                            operator
                                          }
                                        })
                                      }}/>
                    </div>

                    {/*right operand measure*/}
                    <div className="pb-1">
                      <FloatingSelect label={"right operand"}
                                      value={state.rightOperand?.alias}
                                      fields={props.measures}
                                      onChange={event => {
                                        const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                                        const underlyingMeasure = props.measures[index]
                                        setState((prevState) => {
                                          return {
                                            ...prevState,
                                            rightOperand: underlyingMeasure,
                                          }
                                        })
                                      }}/>
                    </div>

                    {/*alias*/}
                    <div className="pb-1">
                      <FloatingInputText textValue={state.alias}
                                         onChange={event => {
                                           setState((prevState) => {
                                             return {
                                               ...prevState,
                                               alias: event.target.value,
                                             }
                                           })
                                         }}/>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                            disabled={!canBuildMeasure()} onClick={createMeasureFromState}>Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}
