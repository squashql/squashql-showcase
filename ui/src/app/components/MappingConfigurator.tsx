import React, {ChangeEvent, useState} from "react"
import {getElementString} from "@/app/components/AxisSelector"
import FloatingSelect from "@/app/components/FloatingSelect"
import {Field} from "@squashql/squashql-js"

interface MappingConfiguratorProps {
  fields: Field[]
}

interface MappingConfiguratorState {
  year?: Field
  month?: Field
  type?: Field
  pnl?: Field
  accrual?: Field
}

const keys: (keyof MappingConfiguratorState)[] = ["year", "month", "type", "pnl", "accrual"]

export default function MappingConfigurator(props: MappingConfiguratorProps) {
  const [state, setState] = useState<MappingConfiguratorState>({})

  function createMeasuresFromState() {

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
                          disabled={!canSave()} onClick={createMeasuresFromState}>Save
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}
