'use client'
import Dashboard from "@/app/components/Dashboard"
import {ForecastQueryProvider} from "@/app/forecast/forecast"
import UploadFile from "@/app/components/UploadFile"

const forecastQueryProvider = new ForecastQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Spending"}
                     queryProvider={forecastQueryProvider}
                     elements={[<UploadFile key={"uf"} table={"forecast"}/>]}/>
  )
}
