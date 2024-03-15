import Select, {ActionMeta} from "react-select"
import {Field, from, QueryResult} from "@squashql/squashql-js"
import {SquashQLTable} from "@/app/lib/tables"
import {queryExecutor, toCriteria} from "@/app/lib/queries"
import React, {useEffect, useState} from "react"
import {getElementString} from "@/app/components/AxisSelector";

interface FiltersSelectorProps {
  table: SquashQLTable
  field: Field
  filters: Map<Field, any[]>
  preSelectedValues: any[]
  onFilterChange: (field: Field, values: any[]) => void
}

interface Option {
  value: string
  label: string
}

export default function FiltersSelector(props: FiltersSelectorProps) {
  const [options, setOptions] = useState<Option[]>()
  const [selectedValues, setSelectedValues] = useState<Option[]>(props.preSelectedValues.map(p => ({
    value: p,
    label: p
  })))

  useEffect(() => {
    const copy = new Map(props.filters)
    copy.delete(props.field)
    const query = from(props.table._name)
            .where(toCriteria(copy)) // smart filtering
            .select([props.field], [], [])
            .build()

    queryExecutor.querier.executeQuery(query)
            .then(result => {
              return (result as QueryResult).cells.map(c => ({
                value: Object.values(c)[0],
                label: Object.values(c)[0]
              }))
            })
            .then(options => setOptions(options))
  }, [props.table._name, props.filters, props.field])

  function onChange(values: readonly Option[], action: ActionMeta<Option>) {
    props.onFilterChange(props.field, values.map(v => v.value))
    setSelectedValues(values.slice())
  }

  return (
          <div className="container px-1">
            <Select options={options} isMulti onChange={onChange} value={selectedValues}/>
          </div>
  )
}
