'use client'
import {PortfolioProvider} from "@/app/portfolio/portfolioProvider"
import UploadFile from "@/app/components/UploadFile"
import dynamic from "next/dynamic"

const portfolioQueryProvider = new PortfolioProvider()

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

export default function Page() {
  return (
          <Dashboard title={"Portfolio"}
                     queryProvider={portfolioQueryProvider}
                     elements={[<UploadFile key={"uf"} table={"portfolio"}/>]}/>
  )
}
