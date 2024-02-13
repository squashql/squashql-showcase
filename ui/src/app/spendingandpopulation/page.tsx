'use client'
import Dashboard from "@/app/components/Dashboard"
import {SpendingAndPopulationQueryProvider} from "@/app/spendingandpopulation/spendingAndPopulationQueryProvider"

const spendingAndPopulationQueryProvider = new SpendingAndPopulationQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Spending and population"} queryProvider={spendingAndPopulationQueryProvider}/>
  )
}