import {getElementString, SelectablePeriod} from "@/app/components/AxisSelector"
import {Field, Measure} from "@squashql/squashql-js"
import React, {ChangeEvent} from "react"

interface FloatingSelectProps {
  label: string,
  value: string | undefined,
  fields: Field[] | Measure[] | SelectablePeriod[] | string[],
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
