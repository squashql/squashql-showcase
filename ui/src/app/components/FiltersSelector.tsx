import Select, {ActionMeta} from "react-select"
import {Field, from, QueryResult} from "@squashql/squashql-js"
import {SquashQLTable} from "@/app/lib/tables"
import {queryExecutor, toCriteria} from "@/app/lib/queries"
import React, {useEffect, useState} from "react"
import {expenseLevels, satisfactionLevels} from "@/app/tutorial/virtualTables"
import {getElementString} from "@/app/components/AxisSelector"

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

function option(value: string): Option {
  return {
    value,
    label: value
  }
}

export default function FiltersSelector(props: FiltersSelectorProps) {
  const [options, setOptions] = useState<Option[]>()

  useEffect(() => {
    const copy = new Map(props.filters)
    copy.delete(props.field)
    const table = props.table
    let promise: Promise<Option[]>
    // FIXME ideally this should not be hardcoded.
    if (getElementString(props.field) === getElementString(satisfactionLevels.satisfactionLevel)) {
      promise = Promise.resolve(satisfactionLevels.getColumnValues().map(s => option(s)))
    } else if (getElementString(props.field) === getElementString(expenseLevels.expenseLevel)) {
      promise = Promise.resolve(expenseLevels.getColumnValues().map(s => option(s)))
    } else {
      const query = from(table._name)
              .where(toCriteria(copy)) // smart filtering
              .select([props.field], [], [])
              .build()

      promise = queryExecutor.querier.executeQuery(query)
              .then(result => {
                return (result as QueryResult).cells.map(c => ({
                  value: Object.values(c)[0],
                  label: Object.values(c)[0]
                }))
              })
    }
    promise.then(options => setOptions(options))
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
  )
}
