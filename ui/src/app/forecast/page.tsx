'use client'
import {ForecastQueryProvider} from "@/app/forecast/forecast"
import UploadFile from "@/app/components/UploadFile"
import dynamic from "next/dynamic"

const qp = new ForecastQueryProvider()

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

export default function Page() {

  return (
          <Dashboard title={"Business planning"}
                     queryProvider={qp}
                     elements={[<UploadFile key={"uf"} table={"forecast"}/>]}/>
  )
}
