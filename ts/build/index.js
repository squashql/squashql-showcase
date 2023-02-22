"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Hello world!');
const squashql_js_1 = require("@squashql/squashql-js");
const querier = new squashql_js_1.Querier("http://localhost:8080");
querier.getMetadata().then(response => {
    console.log(response);
});
const income = (0, squashql_js_1.sumIf)("Income", "Amount", (0, squashql_js_1.criterion)("Income / Expenditure", (0, squashql_js_1.eq)("Income")));
const expenditure = (0, squashql_js_1.sumIf)("Expenditure", "Amount", (0, squashql_js_1.criterion)("Income / Expenditure", (0, squashql_js_1.neq)("Income")));
// const query = from("budget")
//         .where(criterion("Scenario", eq("b")))
//         .select(["Year", "Month", "Category"], [], [income, expenditure])
//         .build()
//
// querier.execute0(query)
//         .then(r => console.log(r));
const netIncome = (0, squashql_js_1.minus)("Net income", income, expenditure);
const netIncomeGrowth = (0, squashql_js_1.comparisonMeasureWithPeriod)("Net Income growth (prev. year)", squashql_js_1.ComparisonMethod.RELATIVE_DIFFERENCE, netIncome, new Map(Object.entries({ ["Year"]: "y-1" })), new squashql_js_1.Year("Year"));
const groups = new Map(Object.entries({
    "group1": ["b", "sc"],
}));
const columnSet = new squashql_js_1.BucketColumnSet("group", "Scenario", groups);
const query = (0, squashql_js_1.from)("budget")
    .select(["Scenario", "Year"], [columnSet], [netIncomeGrowth])
    .build();
querier.execute0(query)
    .then(r => console.log(r));
