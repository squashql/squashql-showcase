'use client'
import Dashboard from "@/app/components/Dashboard"
import {ForecastQueryProvider} from "@/app/forecast/forecast"
import UploadFile from "@/app/components/UploadFile"

const qp = new ForecastQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Business planning"}
                     queryProvider={qp}
                     elements={[<UploadFile key={"uf"} table={"forecast"}/>]}/>
  )
}
