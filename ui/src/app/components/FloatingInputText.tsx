import React, {ChangeEvent} from "react"

interface FloatingInputTextProps {
  textValue: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function FloatingInputText(props: FloatingInputTextProps) {
  return (
          <form className="form-floating">
            <input type="text" className="form-control" id="measureAliasInput"
                   value={props.textValue}
                   onChange={props.onChange}/>
            <label htmlFor="measureAliasInput" className="form-label">alias</label>
          </form>
  )
}
