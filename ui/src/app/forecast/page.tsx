'use client'
import Dashboard from "@/app/components/Dashboard"
import {MonthlyForecastQueryProvider} from "@/app/forecast/forecast"
import UploadFile from "@/app/components/UploadFile"

const qp = new MonthlyForecastQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Business planning (Monthly)"}
                     queryProvider={qp}
                     elements={[<UploadFile key={"uf"} table={"monthly_forecast"}/>]}/>
  )
}
