import {Querier,} from "@squashql/squashql-js"
import {DuckDb} from "./duckDb";
import {url} from "./constants";

const querier = new Querier(url)


// querier.execute(query, undefined, true)
//         .then(r => console.log(r))
// const query = from(budget._name)
//         .select([], [], [countRows])
//         .build()
//
// querier.executeQuery(query, true)
//         .then(r => console.log(r));


const duckdbQuerier = new DuckDb(url)

async function main() {
  await duckdbQuerier.showTables().then(r => console.log(r));
  await duckdbQuerier.getTablesInfo().then(r => console.log(r));
  await duckdbQuerier.createTable("portfolio", "17QFM8B9E0vRPb6v9Ct2zPKobFWWHia53Odfu1LChAY0", "446626508").then(r => console.log(r));
  await duckdbQuerier.createTable("spending", "1WujqnAJXrRGvfzSYKF_uyHhacehbpuOiJ2ygcb5-AYQ", "0").then(r => console.log(r));
  await duckdbQuerier.createTable("population", "1WujqnAJXrRGvfzSYKF_uyHhacehbpuOiJ2ygcb5-AYQ", "1150075574").then(r => console.log(r));
  await duckdbQuerier.showTables().then(r => console.log(r));
}

main()
