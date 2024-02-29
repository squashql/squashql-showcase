import {getElementString, SelectablePeriod, SelectedType} from "@/app/components/AxisSelector"
import React, {ChangeEvent} from "react"

interface FloatingSelectProps {
  label: string,
  value: string | undefined,
  fields: SelectedType[] | SelectablePeriod[] | string[],
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

export default function FloatingSelect(props: FloatingSelectProps) {
  return (
          <div className="form-floating">
            <select className="form-select" id="floatingSelect" aria-label="Floating label select example"
                    onChange={props.onChange}
                    value={props.value === undefined ? 'DEFAULT' : props.value}>
              <option key={-1} value={'DEFAULT'}>Select {props.label}</option>
              {props.fields.map((element, index) =>
                      <option key={index}
                              value={getElementString(element)}>{getElementString(element)}</option>)}
            </select>
            <label htmlFor="floatingSelect">{props.label}</label>
          </div>
  )
}
