'use client'
import Dashboard from "@/app/components/Dashboard"
import {ForecastQueryProvider} from "@/app/forecast/forecast";

const forecastQueryProvider = new ForecastQueryProvider()

export default function Page() {

  return (
          <Dashboard title={"Spending"} queryProvider={forecastQueryProvider}/>
  )
}
