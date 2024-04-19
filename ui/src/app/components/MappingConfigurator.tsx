import React, {ChangeEvent, useState} from "react"
import {getElementString} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import {Field, TableField} from "@squashql/squashql-js"
import leven from "leven"
import {ForecastFields} from "@/app/financialplanning/page"

interface MappingConfiguratorProps {
  fields: TableField[]
  currentMapping?: ForecastFields
  onSave: (mapping: ForecastFields) => void
}

interface MappingConfiguratorState {
  year?: Field
  month?: Field
  type?: Field
  pnl?: Field
  accrual?: Field
}

const keys: (keyof MappingConfiguratorState)[] = ["year", "month", "type", "pnl", "accrual"]

function computeInitialState(props: MappingConfiguratorProps): MappingConfiguratorState {
  const state: MappingConfiguratorState = {}
  for (const k of keys) {
    const fieldNames = props.fields.map(e => e.fieldName.toLowerCase())
    let candidateIndex
    for (const [index, f] of fieldNames.entries()) {
      if (f.includes(k)) {
        candidateIndex = index
        break
      }
    }

    if (!candidateIndex) {
      let [min, minIndex] = [Number.MAX_SAFE_INTEGER, -1]
      for (const [index, f] of fieldNames.entries()) {
        const l = leven(k, f)
        if (l < min) {
          min = l
          minIndex = index
        }
      }
      candidateIndex = minIndex
    }
    state[k] = props.fields[candidateIndex]
  }
  return state
}

export default function MappingConfigurator(props: MappingConfiguratorProps) {
  const initialState = props.currentMapping !== undefined ? props.currentMapping : computeInitialState(props)
  const [state, setState] = useState<MappingConfiguratorState>(initialState)

  function onSave() {
    if (state.accrual && state.type && state.year && state.month && state.pnl) {
      props.onSave({
        accrual: state.accrual,
        year: state.year,
        month: state.month,
        type: state.type,
        pnl: state.pnl,
      })
    }
  }

  function canSave(): boolean {
    return keys.every(k => state[k] !== undefined)
  }

  function onChange<K extends keyof MappingConfiguratorState>(event: ChangeEvent<HTMLSelectElement>, key: K) {
    const index = props.fields.map(v => getElementString(v)).indexOf(event.target.value)
    setState((prevState) => {
      const newState = {
        ...prevState,
      }
      newState[key] = props.fields[index]
      return newState
    })
  }

  return (
          <div className="modal fade" id="mappingconfiguratorModal"
               tabIndex={-1}
               aria-labelledby="mappingconfiguratorModalLabel"
               aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="mappingconfiguratorModalLabel">Define column mapping</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {keys.map(k => {
                    return (
                            <div key={k} className="pb-1">
                              <FloatingSelect key={k}
                                              label={k}
                                              value={getElementString(state[k] ?? "")}
                                              fields={props.fields}
                                              onChange={event => onChange(event, k)}/>
                            </div>
                    )
                  })}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                          disabled={!canSave()} onClick={onSave}>Save
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}
