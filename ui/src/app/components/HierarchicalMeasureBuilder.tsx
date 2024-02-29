import React, {ChangeEvent, useState} from "react"
import {comparisonMeasureWithPeriod, ComparisonMethod, Field, Measure, Month, Year} from "@squashql/squashql-js"
import {getElementString, SelectablePeriod, SelectedType} from "@/app/components/AxisSelector"

interface HierarchicalMeasureBuilderProps {
  measures: Measure[]
  fields: Field[]
  newMeasureHandler: (m: Measure) => void
}

interface HierarchicalMeasureBuilderState {
  underlyingMeasure?: Measure
  alias: string | ""
  comparisonMethod?: ComparisonMethod
}

const initialState = {
  alias: "",
}

const selectablePeriodElements: SelectablePeriod[] = ["Year", "Month"]

export default function HierarchicalMeasureBuilder(props: HierarchicalMeasureBuilderProps) {
  const [state, setState] = useState<HierarchicalMeasureBuilderState>(initialState)

  function createMeasureFromState() {
    let measure
    switch (state.period) {
      case "Year":
        if (state.year && state.underlyingMeasure && state.comparisonMethod && state.referencePosition.size > 0) {
          measure = comparisonMeasureWithPeriod(state.alias, state.comparisonMethod, state.underlyingMeasure, state.referencePosition, new Year(state.year))
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
      props.newMeasureHandler(measure)
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
            <button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal"
                    data-bs-target="#timeperiodcompModal">
              Time period comparison
            </button>

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
                      {(renderSelect("measure", state.underlyingMeasure?.alias, props.measures, event => {
                        const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                        setState({
                          ...state,
                          underlyingMeasure: props.measures[index]
                        })
                      }))}
                    </div>

                    {/*period*/}
                    <div className="pb-1">
                      {(renderSelect("period", state.period, selectablePeriodElements, event => {
                        if (event.target.value === "Year" || event.target.value === "Month") {
                          setState({
                            ...state,
                            period: event.target.value
                          })
                        }
                      }))}
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
                      {state.period && renderSelect("comparison method", state.comparisonMethod && ComparisonMethod[state.comparisonMethod], Object.keys(ComparisonMethod), event => {
                        const index = Object.keys(ComparisonMethod).map(v => getElementString(v)).indexOf(event.target.value)
                        setState({
                          ...state,
                          comparisonMethod: Object.values(ComparisonMethod)[index]
                        })
                      })}
                    </div>

                    {/*reference position*/}
                    <div className="pb-1">
                      {state.period === "Year" && renderSelect("compare with", state.referencePositionLabel, ["previous year"], event => {
                        if (state.year) {
                          if (event.target.value === "previous year") {
                            setState({
                              ...state,
                              referencePosition: new Map([[state.year, "y-1"]]),
                              referencePositionLabel: event.target.value
                            })
                          }
                        }
                      })}
                      {state.period === "Month" && renderSelect("compare with", state.referencePositionLabel, ["previous year, same month", "same year, previous month"], event => {
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
                      })}
                    </div>

                    {/*alias*/}
                    <div className="pb-1">
                      {state.period && renderAlias(state.alias, event => {
                        setState({
                          ...state,
                          alias: event.target.value
                        })
                      })}
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
      return (renderSelect("year", year && getElementString(year), fields, onYearChange))
    case "Month":
      return (
              <div>
                <div className="pb-1">
                  {renderSelect("year", year && getElementString(year), fields, onYearChange)}
                </div>
                <div>
                  {renderSelect("month", month && getElementString(month), fields, onMonthChange)}
                </div>
              </div>
      )
    default:
      return undefined
  }
}

function renderSelect(label: string, value: string | undefined, fields: SelectedType[] | SelectablePeriod[] | string[], onChange: (event: ChangeEvent<HTMLSelectElement>) => void) {
  return (
          <div className="form-floating">
            <select className="form-select" id="floatingSelect" aria-label="Floating label select example"
                    onChange={onChange}
                    value={value === undefined ? 'DEFAULT' : value}>
              <option key={-1} value={'DEFAULT'}>Select {label}</option>
              {fields.map((element, index) =>
                      <option key={index}
                              value={getElementString(element)}>{getElementString(element)}</option>)}
            </select>
            <label htmlFor="floatingSelect">{label}</label>
          </div>
  )
}

function renderAlias(alias: string, onChange: (event: ChangeEvent<HTMLInputElement>) => void) {
  return (
          <form className="form-floating">
            <input type="text" className="form-control" id="measureAliasInput"
                   value={alias}
                   onChange={onChange}/>
            <label htmlFor="measureAliasInput" className="form-label">alias</label>
          </form>
  )
}
