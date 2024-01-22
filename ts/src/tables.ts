import {TableField} from "@squashql/squashql-js"

class Budget {
  readonly _name: string = "budget"
  readonly incomeOrExpenditure: TableField = new TableField("budget.Income / Expenditure")
  readonly category: TableField = new TableField("budget.Category")
  readonly subcategory: TableField = new TableField("budget.Subcategory")
  readonly year: TableField = new TableField("budget.Year")
  readonly month: TableField = new TableField("budget.Month")
  readonly day: TableField = new TableField("budget.Day")
  readonly date: TableField = new TableField("budget.Date")
  readonly description: TableField = new TableField("budget.Description")
  readonly amount: TableField = new TableField("budget.Amount")
  readonly score: TableField = new TableField("budget.Happiness score")
  readonly scenario: TableField = new TableField("budget.Scenario")
}

class SatisfactionLevels {
  readonly _name: string = "satisfaction_level"
  readonly satisfactionLevel: TableField = new TableField("satisfaction_level.satisfaction_level")
  readonly lowerBound: TableField = new TableField("satisfaction_level.lower_bound")
  readonly upperBound: TableField = new TableField("satisfaction_level.upper_bound")
}

class ExpenseLevels {
  readonly _name: string = "expense_level"
  readonly expenseLevel: TableField = new TableField("expense_level.expense_level")
  readonly lowerBound: TableField = new TableField("expense_level.lower_bound")
  readonly upperBound: TableField = new TableField("expense_level.upper_bound")
}

const budget = new Budget()
const satisfactionLevels = new SatisfactionLevels()
const expenseLevels = new ExpenseLevels()

export {
  budget, satisfactionLevels, expenseLevels
}
