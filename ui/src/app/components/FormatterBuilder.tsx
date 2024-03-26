import React, {useState} from "react"
import {Measure} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import {PartialMeasure} from "@/app/lib/queries"
import {Formatter, formatters} from "@/app/lib/formatters"

interface FormatterBuilderBuilderProps {
  measures: Measure[]
  onNewMeasureFormatter: (m: Measure | PartialMeasure, formatter: Formatter) => void
}

interface FormatterBuilderBuilderState {
  measure?: Measure
  formatter?: Formatter
}

export default function FormatterBuilder(props: FormatterBuilderBuilderProps) {
  const [state, setState] = useState<FormatterBuilderBuilderState>({})

  function createFormatterForMeasureFromState() {
    if (state.measure !== undefined && state.formatter !== undefined) {
      props.onNewMeasureFormatter(state.measure, state.formatter)
      setState({}) // Clear everything
    }
  }

  function canAddFormatMeasure(): boolean {
    return state.measure !== undefined && state.formatter !== undefined
  }

  return (
          <div className="modal fade" id="formatmeasModal"
               tabIndex={-1}
               aria-labelledby="formatmeasModalLabel"
               aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="formatmeasModalLabel">Format measure</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                  {/*measure*/}
                  <div className="pb-1">
                    <FloatingSelect label={"measure"}
                                    value={state.measure?.alias}
                                    fields={props.measures}
                                    onChange={event => {
                                      const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                                      const underlyingMeasure = props.measures[index]
                                      setState((prevState) => {
                                        return {
                                          ...prevState,
                                          measure: underlyingMeasure,
                                        }
                                      })
                                    }}/>
                  </div>

                  {/*formatter*/}
                  <div className="pb-1">
                    <FloatingSelect label={"formatter"}
                                    value={state.formatter?.label}
                                    fields={formatters.map(f => f.label)}
                                    onChange={event => {
                                      const index = formatters.map(f => f.label).indexOf(event.target.value)
                                      const formatter = formatters[index]
                                      setState((prevState) => {
                                        return {
                                          ...prevState,
                                          formatter
                                        }
                                      })
                                    }}/>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                          disabled={!canAddFormatMeasure()} onClick={createFormatterForMeasureFromState}>Create
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}
