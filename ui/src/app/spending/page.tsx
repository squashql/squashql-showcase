'use client'
import Dashboard from "@/app/components/Dashboard";
import {SpendingQueryProvider} from "@/app/spending/spending"

const spendingQueryProvider = new SpendingQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Spending"} queryProvider={spendingQueryProvider}/>
  )
}
