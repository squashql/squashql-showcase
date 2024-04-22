'use client'
import {ForecastQueryProvider} from "@/app/financialplanning/financialplanning"
import UploadFile from "@/app/components/UploadFile"
import dynamic from "next/dynamic"
import ForecastPeriodSelector from "@/app/components/ForecastPeriodSelector"
import React, {useEffect, useState} from "react"
import {clearCurrentState, deserialize_} from "@/app/lib/dashboard"
import MappingConfigurator from "@/app/components/MappingConfigurator"
import {queryExecutor} from "@/app/lib/queries"
import {Field, TableField} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import {SquashQLTable} from "@/app/lib/tables"

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

export interface ForecastFields {
  year: Field
  month: Field
  type: Field
  pnl: Field
  accrual: Field
}

interface ForecastPageState {
  table?: SquashQLTable
  mapping?: ForecastFields
  year: number
  month?: number
  version: number
}

const dashboardStorageKey = "dashboard#state#fpna"
const pageStorageKey = "page#state#fpna"
const tableName = "forecast"
const defaultYear = new Date().getFullYear() - 1

function computeInitialState(key: string): ForecastPageState {
  if (typeof window !== "undefined") {
    const data = window.localStorage.getItem(key)
    if (data) {
      return deserialize_(data)
    }
  }
  return {
    year: defaultYear,
    version: 0
  }
}

export default function Page() {
  const [didMount, setDidMount] = useState(false)
  const [state, setState] = useState<ForecastPageState>(computeInitialState(pageStorageKey))

  function onForecastPeriodSelected(year: number, month?: number) {
    clearCurrentState(dashboardStorageKey)
    setState((prevState: ForecastPageState) => {
      return {
        ...prevState,
        year,
        month,
        version: prevState.version + 1
      }
    })
  }

  function onMappingDefined(mapping: ForecastFields) {
    clearCurrentState(dashboardStorageKey)
    setState((prevState: ForecastPageState) => {
      return {
        ...prevState,
        mapping,
        version: prevState.version + 1
      }
    })
  }

  function fetch(resetMapping: boolean) {
    queryExecutor.querier.getMetadata()
            .then(r => {
              const store = r.stores.find(s => s.name === tableName)
              if (store !== undefined) {
                const fields = store.fields.map(value => new TableField(`${tableName}.${value.name}`))
                setState((prevState: ForecastPageState) => {
                  return {
                    ...prevState,
                    table: {
                      _name: store.name,
                      _fields: fields
                    },
                    mapping: resetMapping ? undefined : prevState.mapping,
                    version: prevState.version + 1
                  }
                })
              }
            })
  }

  function onFileUploaded() {
    clearCurrentState(dashboardStorageKey)
    fetch(true)
  }

  useEffect(() => {
    setDidMount(true)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(pageStorageKey, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    fetch(false)
  }, [state.table?._fields.map(e => getElementString(e)).join()])
  // Use join array as dependency because Object.is(["a"], ["a"]) is false

  if (state.table) {
    const qp = new ForecastQueryProvider(state.table, state.mapping, state.year, state.month)
    return didMount && (
            <>
              <Dashboard title={"Financial planning and analysis"}
                         key={"d" + state.version} // use key to force to recreate the component. Needed to properly force the local storage to be updated.
                         queryProvider={qp}
                         storageKey={dashboardStorageKey}
                         menuElements={[
                           <SettingsMenu key={"settings"} year={state.year} month={state.month}
                                         isMappingDefined={state.mapping !== undefined}/>,
                         ]}
                         elements={[<UploadFile key={"uf"} table={tableName} onFileUploaded={onFileUploaded}/>]}/>
              <ForecastPeriodSelector onForecastPeriodSelected={onForecastPeriodSelected}/>
              <MappingConfigurator key={"mc" + state.version}
                                   fields={state.table._fields}
                                   currentMapping={state.mapping}
                                   onSave={onMappingDefined}/>
            </>
    )
  }
}

interface SettingsMenuProps {
  year: number
  month?: number
  isMappingDefined: boolean
}

function SettingsMenu(props: SettingsMenuProps) {
  const c = getNumberOfIncorrectSettings(props)
  return (
          <div className="col px-0 mx-1 my-1">
            <div className="dropdown">
              <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                      aria-expanded="false">
                Settings
                {c > 0 && <>&nbsp;<span className="badge text-bg-danger rounded-pill">{c}</span></>}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item"
                     href="#"
                     data-bs-toggle="modal"
                     data-bs-target="#forecastperiodselectorModal">
                    Actual end period (year={props.year}{props.month && `, month=${props.month}`})
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" data-bs-toggle="modal"
                     data-bs-target="#mappingconfiguratorModal">Configure column mapping
                    {!props.isMappingDefined && <>&nbsp;<span className="badge text-bg-danger rounded-pill">1</span></>}
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider"/>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => clearCurrentState(pageStorageKey)}>Clear
                    settings</a>
                </li>
              </ul>
            </div>
          </div>
  )
}

function getNumberOfIncorrectSettings(props: SettingsMenuProps) {
  let count = 0
  if (!props.isMappingDefined) {
    count++
  }
  if (props.year === undefined) {
    count++
  }
  return count
}
