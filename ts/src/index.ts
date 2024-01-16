import {countRows, from, Querier, QueryResult,} from "@squashql/squashql-js"
import {portfolios} from "./tables"
import {FieldAndAggFunc, VectorTupleAggMeasure} from "./measures";

const querier = new Querier("http://localhost:8080")


const vector = new VectorTupleAggMeasure(
        "vector",
        [
          new FieldAndAggFunc(portfolios.scenarioValue, "sum"),
          new FieldAndAggFunc(portfolios.dateScenario, "any_value")
        ],
        portfolios.dateScenario)
const query = from(portfolios._name)
        .select([portfolios.ticker, portfolios.riskType], [], [vector])
        .rollup([portfolios.ticker, portfolios.riskType])
        .build()

// querier.execute(query, undefined, true)
//         .then(r => console.log(r))
querier.execute(query)
        .then(r => {
          const result: QueryResult = <QueryResult>r
          for (const row of result.table.rows) {
            const a = []
            for (let i = 0; i < row[2][0].length; i++) {
              a.push({
                "value": row[2][0][i],
                "date": row[2][1][i],
              })
            }
            a.sort((e1, e2) => e1.value - e2.value)
            const index = Math.floor(a.length * (1 - 0.95));
            const quantileDate = a[index].date;
            const quantilePnL = -a[index].value;
            let es = 0.
            for (let i = 0; i <= index; i++) {
              es += a[i].value
            }
            const expectedShortfall = -es / (index + 1);
            row[2] = {
              index,
              quantileDate,
              quantilePnL,
              expectedShortfall
            }
          }
          console.log(JSON.stringify(result.table))
        })
