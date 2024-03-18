'use client'
import {BudgetProvider, initialRecords} from "@/app/tutorial/budgetProvider"
import {ChangeEvent} from "react"
import dynamic from "next/dynamic"

const records = initialRecords

interface SatisfactionLevelComponentProps {
  key: string
  onChange: (event: ChangeEvent<HTMLInputElement>, levelIndex: number, boundIndex: number) => void
}

function SatisfactionLevelComponent(props: SatisfactionLevelComponentProps) {
  return (
          <div className="col py-1">
            <button className="btn btn-light btn-sm" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              Change satisfaction levels
            </button>
            <div className="collapse" id="collapseExample">
              <div style={{width: "15rem"}}>
                {["neutral", "happy", "very happy"].map((level, index) => (
                        <div className="input-group input-group-sm" key={level}>
                          <span className="input-group-text" style={{width: "6rem"}}>{level}</span>
                          <input type="number" aria-label="lower" className="form-control"
                                 defaultValue={initialRecords[index][1]} onChange={e => props.onChange(e, index, 1)}/>
                          <input type="number" aria-label="upper" className="form-control"
                                 defaultValue={initialRecords[index][2]} onChange={e => props.onChange(e, index, 2)}/>
                        </div>
                ))}
              </div>
            </div>
          </div>
  )
}

// Dashboard makes use of local storage and window
// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {ssr: false})

export default function Page() {
  const budgetProvider = new BudgetProvider(() => records)

  function onChange(event: ChangeEvent<HTMLInputElement>, levelIndex: number, boundIndex: number) {
    records[levelIndex][boundIndex] = parseInt(event.target.value)
  }

  return (
          <div className="ms-1">
            <Dashboard title={"Tutorial"}
                       queryProvider={budgetProvider}
                       elements={[<SatisfactionLevelComponent key={"sl"} onChange={onChange}/>]}/>
          </div>
  )
}
