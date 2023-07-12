"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const squashql_js_1 = require("@squashql/squashql-js");
const querier = new squashql_js_1.Querier("http://localhost:8080");
const income = (0, squashql_js_1.sumIf)("Income", "Amount", (0, squashql_js_1.criterion)("Income / Expenditure", (0, squashql_js_1.eq)("Income")));
const query = (0, squashql_js_1.from)("budget")
    .where((0, squashql_js_1.criterion)("Scenario", (0, squashql_js_1.eq)("b")))
    .select(["Year", "Month", "Category"], [], [income])
    .build();
querier.execute(query, { rows: ["Year", "Month"], columns: ["Category"] }, true)
    .then(r => {
    console.log(r);
    // showInBrowser(<PivotTableQueryResult>r)
});
// querier.execute(query, undefined, true)
//         .then(r => console.log(r));
// const fs = require('fs');
// let student = {
//   name: 'Mike',
//   age: 23,
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda'
// };
//
// let data = JSON.stringify(student);
// fs.writeFileSync('../target/classes/public/student-2.json', data);
