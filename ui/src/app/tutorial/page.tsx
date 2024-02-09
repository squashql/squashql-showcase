'use client'
import Dashboard from "@/app/components/Dashboard"
import {BudgetProvider} from "@/app/tutorial/budgetProvider"

const budgetProvider = new BudgetProvider()

export default function Page() {

  return (
          <Dashboard title={"Tutorial"} queryProvider={budgetProvider}/>
  )
}
