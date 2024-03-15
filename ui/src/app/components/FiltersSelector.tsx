import Select, {ActionMeta} from "react-select"
import {Field, from, QueryResult} from "@squashql/squashql-js"
import {SquashQLTable} from "@/app/lib/tables"
import {queryExecutor, toCriteria} from "@/app/lib/queries"
import React, {useEffect, useState} from "react"

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
  }

  return (
          <div className="container px-1">
            <Select options={options} isMulti onChange={onChange} value={props.preSelectedValues.map(o => ({
              value: o,
              label: o
            }))}/>
          </div>
  );
}
