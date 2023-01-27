import {
  comparisonMeasureWithBucket,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  criterion,
  eq,
  minus,
  neq,
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
import { MeasuresDescription } from "./types";

const income = sumIf(
  "Income",
  AMOUNT,
  criterion(INCOME_EXPENDITURE, eq(INCOME))
);

const expenditure = sumIf(
  "Expenditure",
  AMOUNT,
  criterion(INCOME_EXPENDITURE, neq(INCOME))
);

const remaining = minus("Remaining money", income, expenditure);

const lastYear = { [YEAR_COLUMN]: "y-1" };
const refScenario = { [SCENARIO_COLUMN]: "s-1", [GROUP_COLUMN]: "g" };

const remainingComp = comparisonMeasureWithBucket(
  "Remaining comp. with prev. scenario",
  ComparisonMethod.ABSOLUTE_DIFFERENCE,
  remaining,
  new Map(Object.entries(refScenario))
);

const expenditureGrowth = comparisonMeasureWithBucket(
  "Expenditure growth",
  ComparisonMethod.ABSOLUTE_DIFFERENCE,
  expenditure,
  new Map(Object.entries(refScenario))
);

const incomeGrowth = comparisonMeasureWithPeriod(
  "Income growth vs. prev. year",
  ComparisonMethod.RELATIVE_DIFFERENCE,
  income,
  new Map(Object.entries(lastYear)),
  new Year(YEAR_COLUMN)
);

export const scenariiMeasures: MeasuresDescription = {
  from: SCENARII_TABLE,
  measures: [income, expenditure, remaining],
  comparisonMeasures: [incomeGrowth, expenditureGrowth, remainingComp],
};
