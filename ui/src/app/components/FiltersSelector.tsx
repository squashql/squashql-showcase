import Select, {ActionMeta} from 'react-select'
import {Field, from, QueryResult, TableField} from "@squashql/squashql-js"
import {QueryProvider} from "@/app/lib/queryProvider"
import {SquashQLTable} from "@/app/lib/tables"
import {queryExecutor} from "@/app/lib/queries"
import React, {useEffect, useState} from "react"

interface FiltersSelectorProps {
  // queryProvider: QueryProvider
  table: SquashQLTable
  field: Field
  filters: Map<Field, any[]>
  onFilterChange: (field: Field, values: any[]) => void
}

interface Option {
  value: string
  label: string
}

function FiltersSelector(props: FiltersSelectorProps) {
  console.log("render FiltersSelector " + (props.field as TableField).fullName)
  const [options, setOptions] = useState<Option[]>()

  useEffect(() => {
    const query = from(props.table._name)
            .select([props.field], [], [])
            .build()

    queryExecutor.querier.executeQuery(query)
            .then(result => {
              // console.log(result)
              return (result as QueryResult).cells.map(c => ({
                value: Object.values(c)[0],
                label: Object.values(c)[0]
              }))
            })
            .then(options => setOptions(options))
  }, [])

  function onChange(values: readonly Option[], action: ActionMeta<Option>) {
    const valuesSt = values.map(v => v.value);
    console.log(valuesSt)
    props.filters.set(props.field, valuesSt)
    props.onFilterChange(props.field, valuesSt)
  }

  return (
          <div>
            <Select options={options} isMulti onChange={onChange}/>
          </div>
  )
}

// export default React.memo(FiltersSelector, (prevProps: Readonly<FiltersSelectorProps>, nextProps: Readonly<FiltersSelectorProps>) => {
//   console.log("Prev");
//   console.log(prevProps);
//   console.log("Next");
//   console.log(nextProps);
//   return false
// })

export default FiltersSelector
