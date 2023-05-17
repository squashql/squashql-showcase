import {
  BucketColumnSet, comparisonMeasureWithBucket,
  comparisonMeasureWithPeriod, ComparisonMethod,
  criterion,
  eq, from, minus, neq,
  Querier, sum, sumIf, Year,
} from "@squashql/squashql-js"

const querier = new Querier("http://localhost:8080")

const income = sumIf("Income", "Amount", criterion("Income / Expenditure", eq("Income")))
const expenditure = sumIf("Expenditure", "Amount", criterion("Income / Expenditure", neq("Income")))

{
  const query = from("budget")
          .where(criterion("Scenario", eq("b")))
          .select(["Year", "Month", "Category"], [], [income, expenditure])
          .build()
  querier.execute0(query).then(r => console.log(r));
}

{
  const netIncome = minus("Net income", income, expenditure)
  const query = from("budget")
          .where(criterion("Scenario", eq("b")))
          .select(["Year", "Month"], [], [netIncome])
          .rollup(["Year", "Month"])
          .build()
  querier.execute0(query).then(r => console.log(r));
}

{
  const netIncome = minus("Net income", income, expenditure)
  const netIncomeGrowth = comparisonMeasureWithPeriod(
          "Net Income growth (prev. year)",
          ComparisonMethod.RELATIVE_DIFFERENCE,
          netIncome,
          new Map(Object.entries({ ["Year"]: "y-1" })),
          new Year("Year")
  )
  const query = from("budget")
          .where(criterion("Scenario", eq("b")))
          .select(["Year", "Month"], [], [netIncome, netIncomeGrowth])
          .build()
  querier.execute0(query).then(r => console.log(r));
}

{
  const netIncome = minus("Net income", income, expenditure)
  const groups = new Map(Object.entries({
    "group1": ["b", "sc", "sco"],
    "group2": ["b", "sm", "smc", "smco"],
    "group3": ["b", "so", "sco", "smco"],
    "group4": ["b", "ss"],
  }))
  const columnSet = new BucketColumnSet("group", "Scenario", groups)
  const netIncomeCompPrev = comparisonMeasureWithBucket(
          "Net Income comp. with prev. scenario",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          netIncome,
          new Map(Object.entries({["Scenario"]: "s-1"})))
  const happiness = sum("Happiness score sum", "Happiness score");
  const happinessCompPrev = comparisonMeasureWithBucket(
          "Happiness score sum comp. with prev. scenario",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          happiness,
          new Map(Object.entries({["Scenario"]: "s-1"})))
  const query = from("budget")
          .where(criterion("Year", eq(2023)))
          .select([], [columnSet], [netIncome, happiness, netIncomeCompPrev, happinessCompPrev])
          .build()
  querier.execute0(query).then(r => console.log(r));
}

