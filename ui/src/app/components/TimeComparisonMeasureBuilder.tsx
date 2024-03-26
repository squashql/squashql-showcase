import React, {ChangeEvent, useState} from "react"
import {
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  Field,
  integer,
  Measure,
  Month,
  multiply,
  Year
} from "@squashql/squashql-js"
import {getElementString, SelectablePeriod} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import FloatingInputText from "@/app/components/FloatingInputText"

interface TimeComparisonMeasureBuilderProps {
  measures: Measure[]
  fields: Field[]
  onNewMeasure: (m: Measure) => void // call when a new measure is created
}

interface TimeComparisonMeasureBuilderState {
  underlyingMeasure?: Measure
  period?: SelectablePeriod
  year?: Field
  month?: Field
  alias: string | ""
  comparisonMethod?: ComparisonMethod
  referencePosition: Map<Field, string>
  referencePositionLabel?: string
}

const initialState = {
  alias: "",
  referencePosition: new Map
}

const selectablePeriodElements: SelectablePeriod[] = ["Year", "Month"]

export default function TimeComparisonMeasureBuilder(props: TimeComparisonMeasureBuilderProps) {
  const [state, setState] = useState<TimeComparisonMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    let measure
    switch (state.period) {
      case "Year":
        const builder = (alias: string) => {
          if (state.year && state.underlyingMeasure && state.comparisonMethod && state.referencePosition.size > 0) {
            return comparisonMeasureWithPeriod(alias, state.comparisonMethod, state.underlyingMeasure, state.referencePosition, new Year(state.year))
          }
        }
        if (state.comparisonMethod === ComparisonMethod.RELATIVE_DIFFERENCE) {
          const underlying = builder("__" + state.alias + "__")
          measure = underlying && multiply(state.alias, integer(100), underlying)
        } else {
          measure = builder(state.alias)
        }
        break
      case "Month":
        if (state.year && state.month && state.underlyingMeasure && state.comparisonMethod && state.referencePosition.size > 0) {
          measure = comparisonMeasureWithPeriod(state.alias, state.comparisonMethod, state.underlyingMeasure, state.referencePosition, new Month(state.month, state.year))
        }
        break
      default:
        break
    }

    if (measure) {
      props.onNewMeasure(measure)
      setState(initialState) // Clear everything
    }
  }

  function canBuildMeasure(): boolean {
    let periodIsOk = false
    switch (state.period) {
      case "Year":
        periodIsOk = state.year !== undefined
        break
      case "Month":
        periodIsOk = state.year !== undefined && state.month !== undefined
        break
    }
    return state.underlyingMeasure !== undefined && state.period !== undefined && periodIsOk && state.alias !== "" && state.comparisonMethod !== undefined && state.referencePosition.size > 0
  }

  return (
          <div>
            {/*The modal is displayed via a button in the menu list*/}
            {/*<button type="button" className="btn btn-sm btn-light" data-bs-toggle="modal"*/}
            {/*        data-bs-target="#timeperiodcompModal">*/}
            {/*  Time period comparison*/}
            {/*</button>*/}

            <div className="modal fade" id="timeperiodcompModal"
                 tabIndex={-1}
                 aria-labelledby="timeperiodcompModalLabel"
                 aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="timeperiodcompModalLabel">Time period comparison</h1>
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

                    {/*period*/}
                    <div className="pb-1">
                      <FloatingSelect label={"period"}
                                      value={state.period}
                                      fields={selectablePeriodElements}
                                      onChange={event => {
                                        if (event.target.value === "Year" || event.target.value === "Month") {
                                          setState({
                                            ...state,
                                            period: event.target.value
                                          })
                                        }
                                      }}/>
                    </div>

                    {/*field(s) selection to build the selected period*/}
                    <div className="pb-1">
                      {state.period && renderSelectPeriod(state.period, state.year, state.month, props.fields,
                              event => {
                                const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
                                setState({
                                  ...state,
                                  year: props.fields[index]
                                })
                              },
                              event => {
                                const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
                                setState({
                                  ...state,
                                  month: props.fields[index]
                                })
                              }
                      )}
                    </div>

                    {/*comparison method*/}
                    <div className="pb-1">
                      {state.period &&
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
                      {state.period === "Year" &&
                              <FloatingSelect label={"compare with"}
                                              value={state.referencePositionLabel}
                                              fields={["previous year"]}
                                              onChange={event => {
                                                if (state.year) {
                                                  if (event.target.value === "previous year") {
                                                    setState({
                                                      ...state,
                                                      referencePosition: new Map([[state.year, "y-1"]]),
                                                      referencePositionLabel: event.target.value
                                                    })
                                                  }
                                                }
                                              }}/>}
                      {state.period === "Month" &&
                              <FloatingSelect label={"compare with"}
                                              value={state.referencePositionLabel}
                                              fields={["previous year, same month", "same year, previous month"]}
                                              onChange={event => {
                                                if (state.year && state.month) {
                                                  if (event.target.value === "previous year, same month") {
                                                    setState({
                                                      ...state,
                                                      referencePosition: new Map([[state.year, "y-1"], [state.month, "m"]]),
                                                      referencePositionLabel: event.target.value
                                                    })
                                                  } else if (event.target.value === "same year, previous month") {
                                                    setState({
                                                      ...state,
                                                      referencePosition: new Map([[state.year, "y"], [state.month, "m-1"]]),
                                                      referencePositionLabel: event.target.value
                                                    })
                                                  }
                                                }
                                              }}/>}
                    </div>

                    {/*alias*/}
                    <div className="pb-1">
                      {state.period &&
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
          </div>
  )
}

function renderSelectPeriod(period: SelectablePeriod,
                            year: Field | undefined,
                            month: Field | undefined,
                            fields: Field[],
                            onYearChange: (event: ChangeEvent<HTMLSelectElement>) => void,
                            onMonthChange: (event: ChangeEvent<HTMLSelectElement>) => void) {
  switch (period) {
    case "Year":
      return (<FloatingSelect label={"year"}
                              value={year && getElementString(year)}
                              fields={fields}
                              onChange={onYearChange}/>)
    case "Month":
      return (
              <div>
                <div className="pb-1">
                  <FloatingSelect label={"year"}
                                  value={year && getElementString(year)}
                                  fields={fields}
                                  onChange={onYearChange}/>
                </div>
                <div>
                  <FloatingSelect label={"month"}
                                  value={month && getElementString(month)}
                                  fields={fields}
                                  onChange={onMonthChange}/>
                </div>
              </div>
      )
    default:
      return undefined
  }
}
