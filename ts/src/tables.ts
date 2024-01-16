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

const budget = new Budget()
const satisfactionLevels = new SatisfactionLevels()

// | Ticker | DateScenario | Currency | NbShares |     RiskType |       ScenarioValue |

class Portfolios {
  readonly _name = "portfolios"
  readonly ticker: TableField = new TableField("portfolios.Ticker")
  readonly dateScenario: TableField = new TableField("portfolios.DateScenario")
  readonly currency: TableField = new TableField("portfolios.Currency")
  readonly riskType: TableField = new TableField("portfolios.RiskType")
  readonly scenarioValue: TableField = new TableField("portfolios.ScenarioValue")
}
const portfolios = new Portfolios()

export {
  budget, satisfactionLevels, portfolios
}
