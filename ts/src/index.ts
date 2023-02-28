console.log('Hello world!')

import {
  sumIf,
  from,
  Querier,
  criterion,
  eq,
  neq,
  minus,
  comparisonMeasureWithPeriod,
  ComparisonMethod, Year, BucketColumnSet, comparisonMeasureWithBucket, avg, sum
} from "@squashql/squashql-js"

const querier = new Querier("http://localhost:8080")

// querier.getMetadata().then(response => {
//   console.log(response)
// })

const income = sumIf("Income", "Amount", criterion("Income / Expenditure", eq("Income")))
const expenditure = sumIf("Expenditure", "Amount", criterion("Income / Expenditure", neq("Income")))
const netIncome = minus("Net income", income, expenditure)
// const netIncomeGrowth = comparisonMeasureWithPeriod(
//         "Net Income growth (prev. year)",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         netIncome,
//         new Map(Object.entries({ ["Year"]: "y-1" })),
//         new Year("Year")
// )

// const query = from("budget")
//         .where(criterion("Scenario", eq("b")))
//         .select(["Year", "Month"], [], [netIncome, netIncomeGrowth])
//         .build()

// const query = from("budget")
//         .where(criterion("Scenario", eq("b")))
//         .select(["Year", "Month", "Category"], [], [income, expenditure])
//         .build()
//
// querier.execute0(query)
//         .then(r => console.log(r));

// const netIncome = minus("Net income", income, expenditure)
//
// const netIncomeGrowth = comparisonMeasureWithPeriod(
//         "Net Income growth (prev. year)",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         netIncome,
//         new Map(Object.entries({["Year"]: "y-1"})),
//         new Year("Year")
// )
//
const groups = new Map(Object.entries({
  "group1": ["b", "sc", "sco"],
  "group2": ["b", "sm", "smc", "smco"],
  "group3": ["b", "so", "sco", "smco"],
  "group4": ["b", "ss"],
}))
const columnSet = new BucketColumnSet("group", "Scenario", groups)
const netIncomeComp = comparisonMeasureWithBucket(
        "Net Income comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map(Object.entries({["Scenario"]: "s-1"})))

const happiness = sum("Happiness score sum", "Happiness score");
const happinessComp = comparisonMeasureWithBucket(
        "Happiness score sum comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map(Object.entries({["Scenario"]: "s-1"})))

const query = from("budget")
        .where(criterion("Year", eq(2023)))
        .select(["Year"], [columnSet], [netIncome, happiness,  netIncomeComp, happinessComp])
        .build()

querier.execute0(query)
        .then(r => console.log(r));
