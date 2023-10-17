import {
  all, BucketColumnSet, comparisonMeasureWithBucket,
  comparisonMeasureWithPeriod,
  ComparisonMethod, ConditionType,
  criterion,
  eq,
  from, JoinType,
  minus,
  neq, PivotTableQueryResult,
  Querier, sum,
  sumIf, TableField, Year,
} from "@squashql/squashql-js"
import {budget, satisfactionLevels} from "./tables";
import {VirtualTable} from "@squashql/squashql-js/dist/virtualtable";
import {criterion_} from "@squashql/squashql-js/dist/conditions";
import {showInBrowser} from "./utils";

// const querier = new Querier("http://localhost:8080")

// const income = sumIf("Income", budget.amount, criterion(budget.incomeOrExpenditure, eq("Income")))
// const expenditure = sumIf("Expenditure", budget.amount, criterion(budget.incomeOrExpenditure, neq("Income")))
// const netIncome = minus("Net income", income, expenditure)
//
// const netIncomeGrowth = comparisonMeasureWithPeriod(
//         "Net Income growth (prev. year)",
//         ComparisonMethod.RELATIVE_DIFFERENCE,
//         netIncome,
//         new Map([[budget.year, "y-1"]]),
//         new Year(budget.year)
// )
// const records = [
//   ["neutral", 0, 2],
//   ["happy", 2, 4],
//   ["very happy", 4, 5],
// ];
// const satisfactionLevelsVT = new VirtualTable(
//         satisfactionLevels._name,
//         [
//           satisfactionLevels.satisfactionLevel.fieldName,
//           satisfactionLevels.lowerBound.fieldName,
//           satisfactionLevels.upperBound.fieldName
//         ], records)
//
// const query = from(budget._name)
//         .joinVirtual(satisfactionLevelsVT, JoinType.INNER)
//         .on(all([
//           criterion_(budget.score, satisfactionLevels.lowerBound, ConditionType.GE),
//           criterion_(budget.score, satisfactionLevels.upperBound, ConditionType.LT)
//         ]))
//         .where(
//                 all([
//                   criterion(budget.scenario, eq("b")),
//                   criterion(budget.year, eq(2023)),
//                 ]))
//         .select([budget.year, satisfactionLevels.satisfactionLevel], [], [expenditure])
//         .build()
//
// const groups = new Map(Object.entries({
//   "group1": ["b", "sc", "sco"],
//   "group2": ["b", "sm", "smc", "smco"],
//   "group3": ["b", "so", "sco", "smco"],
//   "group4": ["b", "ss"],
// }))
// const columnSet = new BucketColumnSet(new TableField("group"), new TableField("Scenario"), groups)
// const netIncomeCompPrev = comparisonMeasureWithBucket(
//         "Net Income comp. with prev. scenario",
//         ComparisonMethod.ABSOLUTE_DIFFERENCE,
//         netIncome,
//         new Map([[budget.scenario, "s-1"]]))
// const happiness = sum("Happiness score sum", budget.score);
// const happinessCompPrev = comparisonMeasureWithBucket(
//         "Happiness score sum comp. with prev. scenario",
//         ComparisonMethod.ABSOLUTE_DIFFERENCE,
//         happiness,
//         new Map([[budget.scenario, "s-1"]]))
// const netIncomeCompFirst = comparisonMeasureWithBucket(
//         "Net Income comp. with first scenario",
//         ComparisonMethod.ABSOLUTE_DIFFERENCE,
//         netIncome,
//         new Map([[budget.scenario, "first"]]))
//
// const query = from(budget._name)
//         .where(criterion(budget.year, eq(2023)))
//         .select([budget.year], [columnSet], [netIncome, happiness, netIncomeCompPrev, happinessCompPrev, netIncomeCompFirst])
//         .build()

const querier = new Querier("http://localhost:8080")
const expenditure = sumIf("Expenditure", budget.amount, criterion(budget.incomeOrExpenditure, neq("Income")))

const pivotConfig = {rows: [budget.year, budget.month], columns: [budget.category]};
const query = from(budget._name)
        .where(criterion(budget.scenario, eq("b")))
        .select([budget.year, budget.month, budget.category], [], [expenditure])
        .build()

querier.execute(query, pivotConfig, true)
        .then(r => console.log(r));
querier.execute(query, pivotConfig)
        .then(r => {
          showInBrowser(<PivotTableQueryResult>r)
        })
