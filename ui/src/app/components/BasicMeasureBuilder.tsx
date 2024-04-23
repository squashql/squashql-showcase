import React, {useState} from "react"
import {AggregatedMeasure, Field, Measure} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import FloatingInputText from "@/app/components/FloatingInputText"

interface BasicMeasureBuilderProps {
  fields: Field[]
  onNewMeasure: (m: Measure) => void
}

type SupportedAggFunc = "sum" | "min" | "max" | "avg" | "count" | "distinct count"
const AGG_FUNCS: SupportedAggFunc[] = ["sum", "min", "max", "avg", "count", "distinct count"]

interface BasicMeasureBuilderState {
  column?: Field
  aggregationFunction?: SupportedAggFunc
  alias: string | ""
}

const initialState = {
  alias: "",
}

export default function BasicMeasureBuilder(props: BasicMeasureBuilderProps) {
  const [state, setState] = useState<BasicMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    if (state.column !== undefined && state.aggregationFunction !== undefined && state.alias !== "") {
      const isDistinctCount = state.aggregationFunction === "distinct count"
      let aggFunc = isDistinctCount ? "count" : state.aggregationFunction
      const measure = new AggregatedMeasure(state.alias, state.column, aggFunc, isDistinctCount)
      props.onNewMeasure(measure)
      setState(initialState) // Clear everything
    }
  }

  function canBuildMeasure(): boolean {
    return state.column !== undefined && state.aggregationFunction !== undefined && state.alias !== ""
  }

  function suggestedAlias(column: Field | undefined, aggFunc: SupportedAggFunc | undefined): string {
    if (state.alias === "" && column && aggFunc) {
      return getElementString(column) + "_" + aggFunc
    } else {
      return state.alias
    }
  }

  return (
          <div className="modal fade" id="basicmeasModal"
               tabIndex={-1}
               aria-labelledby="basicmeasModalLabel"
               aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="basicmeasModalLabel">Basic measure</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                  {/*column*/}
                  <div className="pb-1">
                    <FloatingSelect label={"dimension"}
                                    value={state.column && getElementString(state.column)}
                                    fields={props.fields}
                                    onChange={event => {
                                      const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
                                      setState((prevState) => {
                                        return {
                                          ...prevState,
                                          column: props.fields[index],
                                          alias: suggestedAlias(props.fields[index], prevState.aggregationFunction)
                                        }
                                      })
                                    }}/>
                  </div>

                  {/*agg func*/}
                  <div className="pb-1">
                    <FloatingSelect label={"aggregation function"}
                                    value={state.aggregationFunction}
                                    fields={AGG_FUNCS}
                                    onChange={event => {
                                      const index = AGG_FUNCS.map(e => e.toString()).indexOf(event.target.value)
                                      const aggregationFunction = AGG_FUNCS[index]
                                      setState((prevState) => {
                                        return {
                                          ...prevState,
                                          alias: suggestedAlias(prevState.column, aggregationFunction),
                                          aggregationFunction,
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
  )
}
