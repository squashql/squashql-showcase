'use client'
import * as duckdb from "@duckdb/duckdb-wasm"
import React, {useEffect, useState} from "react"
import {PivotTableQueryResult} from "@squashql/squashql-js"
import dynamic from "next/dynamic"

async function setupDuckDB(): Promise<duckdb.AsyncDuckDBConnection> {
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles()

  // Select a bundle based on browser checks
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES)
  const worker_url = URL.createObjectURL(
          new Blob([`importScripts("${bundle.mainWorker!}");`], {type: 'text/javascript'})
  )

  // Instantiate the asynchronous version of DuckDB-wasm
  const worker = new Worker(worker_url)
  const logger = new duckdb.ConsoleLogger()
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

  const c = await db.connect()
  const sql = `
              -- Create Continents Table
            CREATE TABLE continents (
                continent_id INT PRIMARY KEY,
                continent VARCHAR(50)
            );

            -- Insert data into Continents Table
            INSERT INTO continents (continent_id, continent) VALUES
            (2, 'Europe'),
            (3, 'Asia'),
            (5, 'Africa');

            -- Create Countries Table
            CREATE TABLE countries (
                country_id INT PRIMARY KEY,
                country VARCHAR(50),
                continent_id INT
            );

            -- Insert data into Countries Table
            INSERT INTO countries (country_id, country, continent_id) VALUES
            (101, 'USA', 1),
            (102, 'Canada', 1),
            (103, 'Germany', 2),
            (104, 'France', 2),
            (105, 'China', 3),
            (106, 'India', 3),
            (107, 'Brazil', 4),
            (108, 'Argentina', 4),
            (109, 'Nigeria', 5),
            (110, 'South Africa', 5);

            -- Create Cities Table
            CREATE TABLE cities (
                city_id INT PRIMARY KEY,
                city VARCHAR(50),
                country_id INT,
                sales_amount DECIMAL(10, 2)
            );

            -- Insert data into Cities Table
            INSERT INTO cities (city_id, city, country_id, sales_amount) VALUES
            (1001, 'New York', 101, 15000.00),
            (1002, 'Los Angeles', 101, 12000.50),
            (1003, 'Toronto', 102, 10000.75),
            (1004, 'Berlin', 103, 8000.25),
            (1005, 'Paris', 104, 9500.50),
            (1006, 'Beijing', 105, 12000.00),
            (1007, 'Mumbai', 106, 11000.75),
            (1008, 'Sao Paulo', 107, 13000.25),
            (1009, 'Buenos Aires', 108, 11500.50),
            (1010, 'Lagos', 109, 9000.00),
            (1011, 'Johannesburg', 110, 8500.75),
            (1012, 'Chicago', 101, 12500.00),
            (1013, 'Hamburg', 103, 8500.50),
            (1014, 'Shanghai', 105, 11000.25),
            (1015, 'Delhi', 106, 10500.75),
            (1016, 'Rio de Janeiro', 107, 12000.00),
            (1017, 'Cape Town', 110, 9500.50),
            (1018, 'Toronto', 102, 9800.25),
            (1019, 'Munich', 103, 8800.50),
            (1020, 'Lyon', 104, 9200.25);
  `
  await c.query(sql)

  return c
}

type Column = "continent" | "country" | "city"

function removeItemOnce(arr: string[], value: string) {
  const index = arr.indexOf(value)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

async function execute(c: duckdb.AsyncDuckDBConnection, rollup: Column[]): Promise<string[]> {
  const select: Column[] = ["continent", "country", "city"]
  const base: Column[] = ["continent", "country", "city"]
  rollup.forEach(r => removeItemOnce(base, r))
  const rollupStatement = rollup.length > 0 ? "ROLLUP(" + rollup.join(', ') + ")" : ""
  const groupByRollup = `${base.join(', ')}${base.length > 0 ? ", " : " "}${rollupStatement}`
  const sql = `
    SELECT ${select.join(', ')}, sum(sales_amount) as sales
    FROM cities
           INNER JOIN countries on cities.country_id = countries.country_id
           INNER JOIN continents on continents.continent_id = countries.continent_id
    GROUP BY ${groupByRollup}
    ORDER BY ALL NULLS FIRST
  `
  console.log(sql)

  // Build grouping sets equivalent
  const groupingSets: string[] = []
  groupingSets.push("(" + ["continent", "country", "city"].join(", ") + ")")
  const toRemove: string[] = []
  for (let i = rollup.length - 1; i >= 0; i--) {
    toRemove.push(rollup[i])
    let copy = ["continent", "country", "city"]
    copy = copy.filter(function (e) {
      return !toRemove.includes(e)
    })
    groupingSets.push("(" + copy.join(", ") + ")")
  }
  const table = await c.query(sql)
  return [table.toString(), groupByRollup.trim(), "GROUPING SETS (" + groupingSets.join(", ") + ")"]
}

export default function Page() {
  const [connection, setConnection] = useState<duckdb.AsyncDuckDBConnection | undefined>(undefined)
  const [queryResult, setQueryResult] = useState<PivotTableQueryResult | undefined>(undefined)
  const [rollupStatement, setRollupStatement] = useState<string>("rollup")
  const [groupingSetsStatement, setGroupingSetsStatement] = useState<string>("gs")
  const [columnsCheck, setColumnsCheck] = useState<Record<Column, boolean>>({
    "continent": true,
    "country": true,
    "city": true,
  })

  function refresh(columnsCheckState: Record<Column, boolean>) {
    if (!connection) {
      return
    }
    execute(connection, createRollupArray(columnsCheckState))
            .then(r => {
              const cells = JSON.parse(r[0])
              // console.log(cells)
              cells.forEach((cell: any) => Object.keys(cell).forEach(key => {
                if (cell[key] == null) {
                  delete cell[key]
                }
              }))
              const data = {
                cells: cells,
                rows: ["continent", "country", "city"],
                columns: [],
                values: ["sales"],
                hiddenTotals: []
              }
              setQueryResult(data)
              setRollupStatement(r[1])
              setGroupingSetsStatement(r[2])
            })
  }

  function createRollupArray(columnsCheckState: Record<Column, boolean>) {
    const a: Column[] = []
    Object.entries(columnsCheckState).forEach(([key, value]) => {
      if (value) {
        a.push(key as Column)
      }
    })
    return a
  }

  function toggleColumn(col: Column) {
    const copy = {...columnsCheck}
    switch (col) {
      case "continent":
        copy.continent = !copy.continent
        setColumnsCheck(copy)
        break
      case "country":
        copy.country = !copy.country
        setColumnsCheck(copy)
        break
      case "city":
        copy.city = !copy.city
        setColumnsCheck(copy)
        break
    }
    refresh(copy)
  }

  function Button(col: Column) {
    return (
            <div className="col py-1">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                     checked={columnsCheck[col]}
                     onChange={() => toggleColumn(col)}/>
              <label className="form-check-label px-1" htmlFor="flexCheckChecked">{col}</label>
            </div>
    )
  }

  useEffect(() => {
    setupDuckDB().then(c => setConnection(c))
    return () => {
      connection?.close()
    }
  }, []) // Do not put connection as dependency because it will re-render in infinite loop

  // disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
  const BasicTable = dynamic(() => import("@/app/components/BasicTable"), {ssr: false})

  if (!connection) {
    return <div>Creating the database...</div>
  } else if (queryResult === undefined) {
    refresh(columnsCheck)
    return undefined
  } else {
    return (
            <div className="container">
              <div className="row">
                <div className="col">
                  <p className="lead">
                    <a href={"https://github.com/squashql/squashql-showcase"}>
                      <i className="bi bi-github"></i>
                    </a> (Partial) rollup to grouping sets and vice versa
                  </p>
                  <p style={{fontWeight: 300}}>
                    Powered by: <a href="https://nextjs.org/">nextjs</a>, <a
                          href="https://duckdb.org/docs/api/wasm/overview.html">DuckDB Wasm</a>
                  </p>
                </div>
              </div>
              <div className="row row-cols-auto mb-3">
                <div className="col">
                  <button className="btn btn-dark btn-sm" onClick={() => refresh(columnsCheck)}>Execute</button>
                </div>
                <div className="col py-1">
                  Rollup on:
                </div>
                {Button("continent")}
                {Button("country")}
                {Button("city")}
              </div>

              <div className="row row-cols-auto">
                <div className="col">
                  <BasicTable
                          dataCfg={{
                            data: queryResult.cells,
                            fields: {
                              columns: ["continent", "country", "city", "sales"]
                            },
                          }}
                          options={{
                            width: 400,
                            height: window.innerHeight,
                          }}
                  />
                </div>
                <div className="col">
                  <div className="row">

                    <mark>GROUP BY {rollupStatement}</mark>
                  </div>
                  <div className="row">
                    <small>is equivalent to</small>
                  </div>
                  <div className="row">
                    <mark>GROUP BY {groupingSetsStatement}</mark>
                  </div>
                </div>
              </div>
            </div>
    )
  }
}
