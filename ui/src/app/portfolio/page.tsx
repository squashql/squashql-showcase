'use client'
import {PortfolioProvider, var95MeasureName} from "@/app/portfolio/portfolioProvider"
import UploadFile from "@/app/components/UploadFile"
import {formatNumber} from "@/app/lib/utils"
import dynamic from "next/dynamic"

const portfolioQueryProvider = new PortfolioProvider()

const varFormatter = (value: any) => {
  if (value) {
    const localeDateString = new Date(value[0][0], value[0][1] - 1, value[0][2]).toLocaleDateString()
    return `${formatNumber(value[1])}\n${localeDateString}`
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
                     formatters={[{
                       field: var95MeasureName,
                       formatter: varFormatter
                     }]}
                     elements={[<UploadFile key={"uf"} table={"portfolio"}/>]}/>
  )
}
