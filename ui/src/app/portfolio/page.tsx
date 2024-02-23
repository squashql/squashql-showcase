'use client'
import Dashboard from "@/app/components/Dashboard"
import {PortfolioProvider} from "@/app/portfolio/portfolioProvider"
import UploadFile from "@/app/components/UploadFile"

const portfolioQueryProvider = new PortfolioProvider()

export default function Page() {

  return (
          <Dashboard title={"Portfolio"}
                     queryProvider={portfolioQueryProvider}
                     elements={[<UploadFile key={"uf"} table={"portfolio"}/>]}/>
  )
}
