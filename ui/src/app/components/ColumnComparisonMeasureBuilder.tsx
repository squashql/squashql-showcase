import {useState} from "react"
import {comparisonMeasureWithinSameGroup, ComparisonMethod, Field, Measure} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import FloatingInputText from "@/app/components/FloatingInputText"

interface ColumnComparisonMeasureBuilderProps {
  measures: Measure[]
  fields: Field[]
  onNewMeasure: (m: Measure) => void // call when a new measure is created
}

interface ColumnComparisonMeasureBuilderState {
  underlyingMeasure?: Measure
  column?: Field
  alias: string | ""
  comparisonMethod?: ComparisonMethod
  referencePosition: Map<Field, string>
  referencePositionLabel?: string
}

const initialState = {
  alias: "",
  referencePosition: new Map
}

export default function ColumnComparisonMeasureBuilder(props: ColumnComparisonMeasureBuilderProps) {
  const [state, setState] = useState<ColumnComparisonMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    if (state.underlyingMeasure !== undefined && state.column !== undefined && state.alias !== "" && state.comparisonMethod !== undefined && state.referencePosition.size > 0) {
      props.onNewMeasure(comparisonMeasureWithinSameGroup(state.alias,
              state.comparisonMethod,
              state.underlyingMeasure,
              state.referencePosition))
      setState(initialState) // Clear everything
    }
  }

  function canBuildMeasure(): boolean {
    return state.underlyingMeasure !== undefined && state.column !== undefined && state.alias !== "" && state.comparisonMethod !== undefined && state.referencePosition.size > 0
  }

  return (
          <div className="modal fade" id="columncompModal"
               tabIndex={-1}
               aria-labelledby="columncompModalLabel"
               aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="columncompModalLabel">Dimension comparison</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                  {/*measure*/}
                  <div className="pb-1">
                    <FloatingSelect label={"measure"}
                                    value={state.underlyingMeasure?.alias}
                                    fields={props.measures}
                                    onChange={event => {
                                      const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                                      setState({
                                        ...state,
                                        underlyingMeasure: props.measures[index]
                                      })
                                    }}/>
                  </div>

                  {/*column*/}
                  <div className="pb-1">
                    <FloatingSelect label={"dimension"}
                                    value={state.column && getElementString(state.column)}
                                    fields={props.fields}
                                    onChange={event => {
                                      const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
                                      setState({
                                        ...state,
                                        column: props.fields[index]
                                      })
                                    }}/>
                  </div>

                  {/*comparison method*/}
                  <div className="pb-1">
                    {state.column &&
                            <FloatingSelect label={"comparison method"}
                                            value={state.comparisonMethod}
                                            fields={Object.keys(ComparisonMethod)}
                                            onChange={event => {
                                              const index = Object.keys(ComparisonMethod).map(v => getElementString(v)).indexOf(event.target.value)
                                              setState({
                                                ...state,
                                                comparisonMethod: Object.values(ComparisonMethod)[index]
                                              })
                                            }}/>}
                  </div>

                  {/*reference position*/}
                  <div className="pb-1">
                    {state.comparisonMethod &&
                            <FloatingSelect label={"compare with"}
                                            value={state.referencePositionLabel}
                                            fields={["previous", "first"]}
                                            onChange={event => {
                                              if (state.column) {
                                                const selectedValue = event.target.value
                                                let transform
                                                if (selectedValue === "previous") {
                                                  transform = "s-1"
                                                } else if (selectedValue === "first") {
                                                  transform = "first"
                                                } else {
                                                  throw new Error(`unexpected value ${selectedValue}`)
                                                }
                                                setState({
                                                  ...state,
                                                  referencePosition: new Map([[state.column, transform]]),
                                                  referencePositionLabel: selectedValue
                                                })
                                              }
                                            }}/>}
                  </div>

                  {/*alias*/}
                  <div className="pb-1">
                    {state.referencePositionLabel &&
                            <FloatingInputText
                                    textValue={state.alias}
                                    onChange={event => {
                                      setState({
                                        ...state,
                                        alias: event.target.value
                                      })
                                    }}/>}
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
