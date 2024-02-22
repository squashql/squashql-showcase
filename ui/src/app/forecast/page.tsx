'use client'
import Dashboard from "@/app/components/Dashboard"
import {ForecastQueryProvider} from "@/app/forecast/forecast"
import UploadFiles from "@/app/components/UploadFiles"

const forecastQueryProvider = new ForecastQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Business planning"}
                     queryProvider={forecastQueryProvider}
                     elements={[<UploadFiles key={"uf"}/>]}/>
  )
}
