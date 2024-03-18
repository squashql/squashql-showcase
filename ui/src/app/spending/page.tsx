'use client'
import {SpendingQueryProvider} from "@/app/spending/spending"
import dynamic from "next/dynamic"

const spendingQueryProvider = new SpendingQueryProvider()

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

export default function Page() {
  return (
          <Dashboard title={"Spending"} queryProvider={spendingQueryProvider}/>
  )
}
