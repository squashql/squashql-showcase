'use client'
import * as duckdb from "@duckdb/duckdb-wasm"
import React, {useEffect, useState} from "react"
import {PivotTableQueryResult} from "@squashql/squashql-js"
import dynamic from "next/dynamic"

async function setupDuckDB(): Promise<duckdb.AsyncDuckDBConnection> {
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

  // Select a bundle based on browser checks
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
  const worker_url = URL.createObjectURL(
          new Blob([`importScripts("${bundle.mainWorker!}");`], {type: 'text/javascript'})
  );

  // Instantiate the asynchronus version of DuckDB-wasm
  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  const c = await db.connect();
  const sql = `
              -- Create Continents Table
            CREATE TABLE continents (
                continent_id INT PRIMARY KEY,
                continent_name VARCHAR(50)
            );

            -- Insert data into Continents Table
            INSERT INTO continents (continent_id, continent_name) VALUES
            (2, 'Europe'),
            (3, 'Asia'),
            (5, 'Africa');

            -- Create Countries Table
            CREATE TABLE countries (
                country_id INT PRIMARY KEY,
                country_name VARCHAR(50),
                continent_id INT
            );

            -- Insert data into Countries Table
            INSERT INTO countries (country_id, country_name, continent_id) VALUES
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
                city_name VARCHAR(50),
                country_id INT,
                sales_amount DECIMAL(10, 2)
            );

            -- Insert data into Cities Table
            INSERT INTO cities (city_id, city_name, country_id, sales_amount) VALUES
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
  await c.query(sql);

  return c
}

type Column = "continent" | "country" | "city"

function removeItemOnce(arr: string[], value: string) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

async function execute(c: duckdb.AsyncDuckDBConnection, rollup: Column[]): Promise<string> {
  const base = ["continent", "country", "city"]
  rollup.forEach(r => removeItemOnce(base, r))
  let rollupStatement = undefined
  if (rollup.length > 0) {
    rollupStatement = "rollup(" + rollup.join(', ') + ")"
  }
  const sql = `
    SELECT continent_name as continent, country_name as country, city_name as city, sum(sales_amount) as sales
    FROM cities
           INNER JOIN countries on cities.country_id = countries.country_id
           INNER JOIN continents on continents.continent_id = countries.continent_id
    GROUP BY ${base.join(', ')} ${rollupStatement}
    ORDER BY continent_name, country_name, city_name
  `
  console.log(sql)
  const table = await c.query(sql);
  return table.toString();
}

export default function Page() {
  const [connection, setConnection] = useState<duckdb.AsyncDuckDBConnection | undefined>(undefined)
  const [queryResult, setQueryResult] = useState<PivotTableQueryResult | undefined>(undefined)
  const [continentCheck, setContinentCheck] = useState(true)
  const [countryCheck, setCountryCheck] = useState(true)
  const [cityCheck, setCityCheck] = useState(true)

  function refreshFromState() {
    if (!connection) {
      return
    }
    execute(connection, ["continent", "country", "city"])
            .then(r => {
              const cells = JSON.parse(r)
              cells.forEach((cell: any) => Object.keys(cell).forEach(key => {
                if (cell[key] == null) {
                  delete cell[key];
                }
              }))
              const data = {
                cells: cells,
                rows: ["continent", "country", "city"],
                columns: [],
                values: ["sales"]
              }
              // console.log(data)
              setQueryResult(data)
            });
  }

  function toggleColumn(col: Column) {
    switch (col) {
      case "continent":
        setContinentCheck(!continentCheck)
        break;
      case "country":
        setCountryCheck(!countryCheck)
        break;
      case "city":
        setCityCheck(!cityCheck)
        break;
    }
  }

  useEffect(() => {
    setupDuckDB().then(c => setConnection(c))
    return () => {
      connection?.close()
    }
  }, [])

  // disable the server-side render for the PivotTable otherwise it leads to "window is not defined" error
  const PivotTable = dynamic(() => import("@/app/components/PivotTable"), {ssr: false})

  if (!connection) {
    return <div>Creating the database...</div>
  } else if (queryResult === undefined) {
    refreshFromState()
    return undefined
  } else {
    return (
            <div className="ms-2">
              <div className="row row-cols-auto">
                <div className="col">
                  <button className="btn btn-ligth" onClick={refreshFromState}>Execute</button>
                </div>
                <div className="col py-2 ms-2">
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                         checked={continentCheck}
                         onChange={() => toggleColumn("continent")}/>
                  <label className="form-check-label px-1" htmlFor="flexCheckChecked">
                    continent
                  </label>
                </div>
                <div className="col py-2 ms-2">
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                         checked={countryCheck}
                         onChange={() => toggleColumn("country")}/>
                  <label className="form-check-label px-1" htmlFor="flexCheckChecked">
                    country
                  </label>
                </div>
                <div className="col py-2 ms-2">
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={cityCheck}
                         onChange={() => toggleColumn("city")}/>
                  <label className="form-check-label px-1" htmlFor="flexCheckChecked">
                    city
                  </label>
                </div>
              </div>
              <PivotTable result={queryResult} width={350} colShowGrandTotal={false}/>
            </div>
    )
  }
}
