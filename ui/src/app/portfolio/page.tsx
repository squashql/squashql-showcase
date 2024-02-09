'use client'
import Dashboard from "@/app/components/Dashboard"
import {PortfolioProvider} from "@/app/portfolio/portfolioProvider"

const portfolioQueryProvider = new PortfolioProvider()

export default function Page() {

  return (
          <Dashboard title={"Portfolio"} queryProvider={portfolioQueryProvider}/>
  )
}
