'use client'

import {useSearchParams} from 'next/navigation'
import {Suspense} from 'react'
import React, {useEffect, useState} from "react"
import axios from "axios"
import {url} from "@/app/lib/constants"
import {QueryResult} from "@squashql/squashql-js"
import dynamic from "next/dynamic"

// disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
const BasicTable = dynamic(() => import("@/app/components/BasicTable"), {ssr: false})

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 30_000,
})

// See why Suspense is needed. https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function Page() {
  return (
          <Suspense>
            <Table/>
          </Suspense>
  )
}

function Table() {
  const searchParams = useSearchParams()
  const [queryResult, setQueryResult] = useState<QueryResult>()

  const tableName = searchParams.get('name')

  useEffect(() => {
    axiosInstance
            .post(`/show-table?tablename=${tableName}`)
            .then(r => setQueryResult(r.data))
  }, [tableName])

  return (
          <div className="container-fluid">
            <div className="row">
              <h5>Table: {tableName}</h5>
            </div>
            {queryResult &&
                    <div className="row">
                      <BasicTable
                              dataCfg={{
                                data: queryResult.cells,
                                fields: {
                                  columns: queryResult.columns
                                },
                              }}
                              options={{
                                width: window.innerWidth - 20,
                                height: window.innerHeight - 44,
                                style: {
                                  layoutWidthType: 'compact',
                                },
                              }}
                      />
                    </div>}
          </div>
  )
}
