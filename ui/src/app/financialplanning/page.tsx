'use client'
import {ForecastQueryProvider} from "@/app/financialplanning/financialplanning"
import UploadFile from "@/app/components/UploadFile"
import dynamic from "next/dynamic"
import ForecastPeriodSelector from "@/app/components/ForecastPeriodSelector"
import React, {useState} from "react"
import {clearCurrentState} from "@/app/lib/dashboard"
import MappingConfigurator from "@/app/components/MappingConfigurator"

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

interface ForecastPageState {
  queryProvider: ForecastQueryProvider
  version: number
}

export default function Page() {
  const defaultValue = new Date().getFullYear() - 1
  const [state, setState] = useState<ForecastPageState>({
    queryProvider: new ForecastQueryProvider(defaultValue),
    version: 0
  })
  const storageKey = "state#fpna"

  function onForecastPeriodSelected(year: number, month?: number) {
    const newQueryProvider = new ForecastQueryProvider(year)
    clearCurrentState(storageKey)
    setState((prevState: ForecastPageState) => {
      return {
        queryProvider: newQueryProvider,
        version: prevState.version + 1
      }
    })
  }

  return (
          <>
            <Dashboard title={"Financial planning and analysis"}
                       key={state.version} // use key to force to recreate the component. Need to properly force the local storage to be updated.
                       queryProvider={state.queryProvider}
                       storageKey={storageKey}
                       menuElements={[<SettingsMenu key={"settings"} year={state.queryProvider.year}/>]}
                       elements={[<UploadFile key={"uf"} table={"forecast"}/>]}/>

            <ForecastPeriodSelector onForecastPeriodSelected={onForecastPeriodSelected}/>
            <MappingConfigurator fields={state.queryProvider.selectableFields}/>
          </>
  )
}

interface SettingsMenuProps {
  year: number
}

function SettingsMenu(props: SettingsMenuProps) {
  return (
          <div className="col px-0 mx-1 my-1">
            <div className="dropdown">
              <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                      aria-expanded="false">
                Settings
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#" data-bs-toggle="modal"
                     data-bs-target="#forecastperiodselectorModal">Forecast start period (year = {props.year})</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" data-bs-toggle="modal"
                     data-bs-target="#mappingconfiguratorModal">Configure column mapping</a>
                </li>
              </ul>
            </div>
          </div>
  )
}
