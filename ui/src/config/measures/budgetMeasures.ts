import {
  comparisonMeasureWithBucket,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  criterion,
  eq,
  minus,
  neq, sum,
  sumIf,
  Year,
} from "@squashql/squashql-js";
import {
  AMOUNT,
  GROUP_COLUMN,
  INCOME,
  INCOME_EXPENDITURE,
  SCENARII_TABLE,
  SCENARIO_COLUMN,
  YEAR_COLUMN,
} from "../constants";
import {MeasuresDescription} from "./types"

const income = sumIf(
        "Income",
        AMOUNT,
        criterion(INCOME_EXPENDITURE, eq(INCOME))
)

const expenditure = sumIf(
        "Expenditure",
        AMOUNT,
        criterion(INCOME_EXPENDITURE, neq(INCOME))
)

const netIncome = minus("Net income", income, expenditure)
const lastYear = {[YEAR_COLUMN]: "y-1"}
const netIncomeGrowth = comparisonMeasureWithPeriod(
        "Net Income growth (prev. year)",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        netIncome,
        new Map(Object.entries(lastYear)),
        new Year(YEAR_COLUMN)
)

const refScenario = {[SCENARIO_COLUMN]: "s-1", [GROUP_COLUMN]: "g"}
const netIncomeComp = comparisonMeasureWithBucket(
        "Net Income comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map(Object.entries(refScenario))
)

const happiness = sum("Happiness score sum", "Happiness score");
const happinessComp = comparisonMeasureWithBucket(
        "Happiness score sum comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map(Object.entries(refScenario)))

export const scenariiMeasures: MeasuresDescription = {
  from: SCENARII_TABLE,
  measures: [income, expenditure, netIncome],
  comparisonMeasures: [netIncomeGrowth, netIncomeComp, happinessComp],
}
