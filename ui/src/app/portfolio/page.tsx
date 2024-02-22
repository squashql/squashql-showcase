'use client'
import Dashboard from "@/app/components/Dashboard"
import {PortfolioProvider} from "@/app/portfolio/portfolioProvider"
import UploadFiles from "@/app/components/UploadFiles"

const portfolioQueryProvider = new PortfolioProvider()

export default function Page() {

  return (
          <Dashboard title={"Portfolio"}
                     queryProvider={portfolioQueryProvider}
                     elements={[<UploadFiles key={"uf"}/>]}/>
  )
}
