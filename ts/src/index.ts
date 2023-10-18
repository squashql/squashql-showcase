import {from, Querier,} from "@squashql/squashql-js"
import {budget} from "./tables";

const querier = new Querier("http://localhost:8080")

const query = from(budget._name)// TODO continue to edit the query

// querier.execute(query, undefined, true)
//         .then(r => console.log(r))
