import Select, {ActionMeta} from 'react-select'
import {Field, from, QueryResult, TableField} from "@squashql/squashql-js"
import {QueryProvider} from "@/app/lib/queryProvider"
import {SquashQLTable} from "@/app/lib/tables"
import {queryExecutor, toCriteria} from "@/app/lib/queries"
import React, {useEffect, useState} from "react"

interface FiltersSelectorProps {
  table: SquashQLTable
  field: Field
  filters: Map<Field, any[]>
  onFilterChange: (field: Field, values: any[]) => void
}

interface Option {
  value: string
  label: string
}

export default function FiltersSelector(props: FiltersSelectorProps) {
  const [options, setOptions] = useState<Option[]>()

  useEffect(() => {
    const query = from(props.table._name)
            .where(toCriteria(props.filters)) // smart filtering
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
  }, [])

  function onChange(values: readonly Option[], action: ActionMeta<Option>) {
    const valuesSt = values.map(v => v.value);
    props.filters.set(props.field, valuesSt)
    props.onFilterChange(props.field, valuesSt)
  }

  return (
          <div className="w-50 py-1">
            <Select options={options} isMulti onChange={onChange}/>
          </div>
  )
}
