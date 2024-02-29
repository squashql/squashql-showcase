import React, {ChangeEvent, useState} from "react"
import {comparisonMeasureWithPeriod, ComparisonMethod, Field, Measure, Month, Year} from "@squashql/squashql-js"
import {getElementString, SelectablePeriod, SelectedType} from "@/app/components/AxisSelector"

interface TimeComparisonMeasureBuilderProps {
  measures: Measure[]
  fields: Field[]
  newMeasureHandler: (m: Measure) => void
}

const selectablePeriodElements: SelectablePeriod[] = ["Year", "Month"]

export default function TimeComparisonMeasureBuilder(props: TimeComparisonMeasureBuilderProps) {
  const [underlyingMeasure, setUnderlyingMeasure] = useState<Measure | undefined>(undefined)
  const [period, setPeriod] = useState<SelectablePeriod | undefined>(undefined)
  const [year, setYear] = useState<Field | undefined>(undefined);
  const [month, setMonth] = useState<Field | undefined>(undefined);
  const [alias, setAlias] = useState<string>("");
  const [comparisonMethod, setComparisonMethod] = useState<ComparisonMethod | undefined>(undefined);
  const [referencePosition, setReferencePosition] = useState<Map<Field, string>>(new Map);
  const [referencePositionSt, setReferencePositionSt] = useState<string | undefined>(undefined);

  function createMeasureFromState() {
    let measure
    switch (period) {
      case "Year":
        if (year && underlyingMeasure && comparisonMethod && referencePosition.size > 0) {
          measure = comparisonMeasureWithPeriod(alias, comparisonMethod, underlyingMeasure, referencePosition, new Year(year))
        }
        break
      case "Month":
        if (year && month && underlyingMeasure && comparisonMethod && referencePosition.size > 0) {
          measure = comparisonMeasureWithPeriod(alias, comparisonMethod, underlyingMeasure, referencePosition, new Month(month, year))
        }
        break
      default:
        break
    }

    if (measure) {
      props.newMeasureHandler(measure)
      // Clear everything
      setUnderlyingMeasure(undefined)
      setPeriod(undefined)
      setYear(undefined)
      setMonth(undefined)
      setAlias("")
      setComparisonMethod(undefined)
      setReferencePosition(new Map)
    }
  }

  function canBuildMeasure(): boolean {
    let periodIsOk = false
    switch (period) {
      case "Year":
        periodIsOk = year !== undefined
        break
      case "Month":
        periodIsOk = year !== undefined && month !== undefined
        break
    }
    return underlyingMeasure !== undefined && period !== undefined && periodIsOk && alias !== "" && comparisonMethod !== undefined && referencePosition.size > 0
  }

  console.log(" start render Time comp")

  console.log(underlyingMeasure)
  console.log(period)
  console.log(" end render Time comp")

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
                      {(renderSelect("measure", underlyingMeasure?.alias, props.measures, event => {
                        const index = props.measures.map(v => getElementString(v)).indexOf(event.target.value)
                        setUnderlyingMeasure(props.measures[index])
                      }))}
                    </div>

                    {/*period*/}
                    <div className="pb-1">
                      {(renderSelect("period", period, selectablePeriodElements, event => {
                        if (event.target.value === "Year" || event.target.value === "Month") {
                          setPeriod(event.target.value);
                        }
                      }))}
                    </div>

                    {/*field(s) selection to build the selected period*/}
                    <div className="pb-1">
                      {period && renderSelectPeriod(period, year, month, props.fields,
                              event => {
                                const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
                                setYear(props.fields[index])
                              },
                              event => {
                                const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
                                setMonth(props.fields[index])
                              }
                      )}
                    </div>

                    {/*comparison method*/}
                    <div className="pb-1">
                      {period && renderSelect("comparison method", comparisonMethod && ComparisonMethod[comparisonMethod], Object.keys(ComparisonMethod), event => {
                        const index = Object.keys(ComparisonMethod).map(v => getElementString(v)).indexOf(event.target.value)
                        setComparisonMethod(Object.values(ComparisonMethod)[index])
                      })}
                    </div>

                    {/*reference position*/}
                    <div className="pb-1">
                      {period === "Year" && renderSelect("compare with", referencePositionSt, ["previous year"], event => {
                        if (year) {
                          if (event.target.value === "previous year") {
                            setReferencePosition(new Map([[year, "y-1"]]));
                          }
                          setReferencePositionSt(event.target.value);
                        }
                      })}
                      {period === "Month" && renderSelect("compare with", referencePositionSt, ["previous year, same month", "same year, previous month"], event => {
                        if (year && month) {
                          if (event.target.value === "previous year, same month") {
                            setReferencePosition(new Map([[year, "y-1"], [month, "m"]]));
                          } else if (event.target.value === "same year, previous month") {
                            setReferencePosition(new Map([[year, "y"], [month, "m-1"]]));
                          }
                          setReferencePositionSt(event.target.value);
                        }
                      })}
                    </div>

                    {/*alias*/}
                    <div className="pb-1">
                      {period && renderAlias(alias, setAlias)}
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
            <label htmlFor="floatingSelect">{label} field</label>
          </div>
  )
}

function renderAlias(alias: string, setAlias: (value: (((prevState: string) => string) | string)) => void) {
  return (
          <form className="form-floating">
            <input type="text" className="form-control" id="measureAliasInput"
                   value={alias}
                   onChange={e => setAlias(e.target.value)}/>
            <label htmlFor="measureAliasInput" className="form-label">alias</label>
          </form>
  )
}
