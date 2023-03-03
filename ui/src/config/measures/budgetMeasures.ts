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

const prevRefScenario = {[SCENARIO_COLUMN]: "s-1", [GROUP_COLUMN]: "g"}
const firstRefScenario = {[SCENARIO_COLUMN]: "first", [GROUP_COLUMN]: "g"}
const netIncomeCompPrev = comparisonMeasureWithBucket(
        "Net Income comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map(Object.entries(prevRefScenario)))
const netIncomeCompFirst = comparisonMeasureWithBucket(
        "Net Income comp. with first scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map(Object.entries(firstRefScenario)))

const happiness = sum("Happiness score sum", "Happiness score");
const happinessCompPrev = comparisonMeasureWithBucket(
        "Happiness score sum comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map(Object.entries(prevRefScenario)))
const happinessCompFirst = comparisonMeasureWithBucket(
        "Happiness score sum comp. with first scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map(Object.entries(firstRefScenario)))

export const scenariiMeasures: MeasuresDescription = {
  from: SCENARII_TABLE,
  measures: [income, expenditure, netIncome],
  comparisonMeasures: [netIncomeGrowth, netIncomeCompPrev, netIncomeCompFirst, happinessCompPrev, happinessCompFirst],
}
