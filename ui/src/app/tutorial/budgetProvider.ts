import {
  all,
  comparisonMeasureWithPeriod,
  ComparisonMethod, ConditionType,
  countRows,
  criterion, criterion_,
  eq,
  Field,
  from, integer, JoinType,
  Measure,
  minus, multiply,
  neq,
  Query,
  QueryMerge,
  sumIf,
  Year
} from "@squashql/squashql-js"
import {budget} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {expenseLevels, expenseLevelsVT, satisfactionLevels, satisfactionLevelsVT} from "@/app/tutorial/virtualTables"

function createMeasures(): Measure[] {
  const income = sumIf("Income", budget.amount, criterion(budget.incomeExpenditure, eq("Income")))
  const expenditure = sumIf("Expenditure", budget.amount, criterion(budget.incomeExpenditure, neq("Income")))
  const netIncome = minus("Net Income", income, expenditure)
  const netIncomeGrowth = comparisonMeasureWithPeriod(
          "YoY Net Income Growth",
          ComparisonMethod.RELATIVE_DIFFERENCE,
          netIncome,
          new Map([[budget.year, "y-1"]]),
          new Year(budget.year)
  )
  const percentageNetIncomeGrowth = multiply("% YoY Net Income Growth", netIncomeGrowth, integer(100))
  return [countRows, income, expenditure, netIncome, percentageNetIncomeGrowth]
}

export class BudgetProvider implements QueryProvider {

  readonly selectableFields = budget._fields.concat([satisfactionLevels.satisfactionLevel, expenseLevels.expenseLevel])
  readonly measures = createMeasures()

  query(select: Field[], values: Measure[]): QueryMerge | Query {
    const table = from(budget._name)
    const orderByFuncs = []
    if (select.includes(satisfactionLevels.satisfactionLevel)) {
      // Need to add a join
      table.joinVirtual(satisfactionLevelsVT, JoinType.INNER)
              .on(all([
                criterion_(budget.happinessScore, satisfactionLevels.lowerBound, ConditionType.GE),
                criterion_(budget.happinessScore, satisfactionLevels.upperBound, ConditionType.LT)
              ]))
      orderByFuncs.push((r: any) => r.orderByFirstElements(satisfactionLevels.satisfactionLevel, ["neutral", "happy", "very happy"]))
    }
    if (select.includes(expenseLevels.expenseLevel)) {
      table.joinVirtual(expenseLevelsVT, JoinType.INNER)
              .on(all([
                criterion_(budget.amount, expenseLevels.lowerBound, ConditionType.GE),
                criterion_(budget.amount, expenseLevels.upperBound, ConditionType.LT)
              ]))
      orderByFuncs.push((r: any) => r.orderByFirstElements(expenseLevels.expenseLevel, ["low", "medium", "high"]))
    }

    const canAddRollup = table
            .where(criterion(budget.scenario, eq("b")))
            .select(select, [], values)
    orderByFuncs.map(f => f(canAddRollup))
    return canAddRollup.build();
  }
}
