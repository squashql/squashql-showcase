'use client'
import UploadFile from "@/app/components/UploadFile"
import dynamic from "next/dynamic"
import React, {useEffect, useState} from "react"
import {clearCurrentState} from "@/app/lib/dashboard"
import {queryExecutor} from "@/app/lib/queries"
import {TableField} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import {SquashQLTable} from "@/app/lib/tables"
import {BlankQueryProvider} from "@/app/blank/blank"

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

interface PageState {
  table?: SquashQLTable
  version: number
}

const tableName = "blank"
const dashboardStorageKey = `dashboard#state#${tableName}`

export default function Page() {
  const [didMount, setDidMount] = useState(false)
  const [state, setState] = useState<PageState>({
    version: 0
  })

  function fetch() {
    queryExecutor.querier.getMetadata()
            .then(r => {
              const store = r.stores.find(s => s.name === tableName)
              if (store !== undefined) {
                const fields = store.fields.map(value => new TableField(`${tableName}.${value.name}`))
                setState((prevState: PageState) => {
                  return {
                    ...prevState,
                    table: {
                      _name: store.name,
                      _fields: fields
                    },
                    version: prevState.version + 1
                  }
                })
              }
            })
  }

  useEffect(() => {
    setDidMount(true)
  }, [])

  useEffect(() => {
    fetch()
  }, [state.table?._fields.map(e => getElementString(e)).join()])

  // Use join array as dependency because Object.is(["a"], ["a"]) is false

  function getUploadFile() {
    return <UploadFile key={"uf"} table={tableName} onFileUploaded={() => {
      clearCurrentState(dashboardStorageKey)
      fetch()
    }}/>
  }

  if (state.table) {
    const qp = new BlankQueryProvider(state.table)
    return didMount && (
            <Dashboard title={"Financial planning and analysis"}
                       key={"d" + state.version} // use key to force to recreate the component. Needed to properly force the local storage to be updated.
                       queryProvider={qp}
                       storageKey={dashboardStorageKey}
                       elements={[getUploadFile()]}/>
    )
  } else {
    return (
            <div className="row row-cols-auto p-2">
              {getUploadFile()}
            </div>
    )
  }
}
