import React, {useState} from "react"
import FloatingSelect from "@/app/components/FloatingSelect"

interface ForecastPeriodSelectorProps {
  onForecastPeriodSelected: (year: number, month?: number) => void
}

interface ForecastPeriodSelectorState {
  year?: number
  month?: number
}

const years: number[] = []
const currentYear = new Date().getFullYear()
for (let i = currentYear; i >= currentYear - 5; i--) {
  years.push(i)
}
const months: number[] = Array.from({length: 12}, (__, index) => index + 1)

export default function ForecastPeriodSelector(props: ForecastPeriodSelectorProps) {
  const [state, setState] = useState<ForecastPeriodSelectorState>({})

  function createMeasuresFromState() {
    if (state.year !== undefined) {
      props.onForecastPeriodSelected(state.year, state.month)
    }
  }

  function canBuild(): boolean {
    return state.year !== undefined
  }

  return (
          <div className="modal fade" id="forecastperiodselectorModal"
               tabIndex={-1}
               aria-labelledby="forecastperiodselectorModalLabel"
               aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="forecastperiodselectorModalLabel">Forecast start period</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                  {/* year */}
                  <div className="pb-1">
                    <FloatingSelect label={"year"}
                                    value={state.year?.toString()}
                                    fields={years.map(y => y.toString())}
                                    onChange={event => {
                                      const year = Number(event.target.value)
                                      setState((prevState) => {
                                        return {
                                          ...prevState,
                                          year
                                        }
                                      })
                                    }}/>
                  </div>

                  {/* month */}
                  <div className="pb-1">
                    <FloatingSelect label={"month"}
                                    value={state.month?.toString()}
                                    fields={months.map(m => m.toString())}
                                    onChange={event => {
                                      const month = Number(event.target.value)
                                      setState((prevState) => {
                                        return {
                                          ...prevState,
                                          month
                                        }
                                      })
                                    }}/>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                          disabled={!canBuild()} onClick={createMeasuresFromState}>Save
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}
