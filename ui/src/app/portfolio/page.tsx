'use client'
import {PortfolioProvider, var95MeasureName} from "@/app/portfolio/portfolioProvider"
import UploadFile from "@/app/components/UploadFile"
import dynamic from "next/dynamic"
import {defaultNumberFormatter} from "@/app/lib/formatters"
import {PivotTableCellFormatter} from "@/app/lib/dashboard"

const portfolioQueryProvider = new PortfolioProvider()

const varFormatter = (value: any) => {
  if (value) {
    const localeDateString = new Date(value[0][0], value[0][1] - 1, value[0][2]).toLocaleDateString()
    return `${defaultNumberFormatter.formatter(value[1])}\n${localeDateString}`
  }
  return ""
}

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

export default function Page() {
  return (
          <Dashboard title={"Portfolio"}
                     queryProvider={portfolioQueryProvider}
                     formatters={[new PivotTableCellFormatter(var95MeasureName, {
                       label: "var95",
                       formatter: varFormatter
                     })]}
                     elements={[<UploadFile key={"uf"} table={"portfolio"}/>]}/>
  )
}
