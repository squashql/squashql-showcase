# Context

This is a web app for combining and comparing scenarios, based on [AITM\* project](https://github.com/paulbares/aitm).
The goal is to provide a user-friendly UI to create scenarios and compare them through different indicators, to make the right decision. These indicators can be compared in different types of visualizations: tree graph, reporting table and PDF export.

# Getting Started

### Prerequisites

To run this project you'll need:

- [yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)
- [AITM](https://github.com/paulbares/aitm)

### Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
In the project directory, you can run:

- `yarn install` to install the project dependencies.
- `yarn start` to run the app in the development mode. Then open [http://localhost:3000](http://localhost:3000) to view it in your browser.
- `yarn build` to build the app for production to the `build` folder. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Configuration

#### Constants

Go to `config/constants.ts` to define:

- `ROOT_URL`: AITM server URL
- `SCENARII_TABLE`: table name where the scenarii are.
- `SCENARIO_COLUMN`: column name of the scenarii in this table.
- `PERIODS`: array of periods columns (if the project has time related data)

#### Measures implementation

Go to `config/measures/` to define measures using `aitm-js-query` library from [AITM](https://github.com/paulbares/aitm).

Create one file per table, to declare the related measures in this folder.
Then, export all measures of each table.

Example:

1. Declare measures in `config/measures/scenariiTableMeasures.ts`. Put in "comparisonMeasures", the measures with scenario comparison to make them appear nicely as delta in the scenario grouping UI.

```
import {
  sum,
  sumIf,
  eq,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  ColumnSetKey,
  from,
} from "aitm-js-query";
import { SCENARII_TABLE, YEAR_COLUMN } from "../constants";
import { MeasuresDescription } from "./types";

const amount = sum("amount_sum", "Amount");
const sales = sumIf("sales", "Amount", "IncomeExpense", eq("Revenue"));

const lastYear = { [YEAR_COLUMN]: "y-1" };
const refScenario = { [SCENARIO_COLUMN]: "s-1", [GROUP_COLUMN]: "g" };

const growth = comparisonMeasureWithPeriod(
  "Growth",
  ComparisonMethod.RELATIVE_DIFFERENCE,
  sales,
  new Map(Object.entries(lastYear)),
  new Year(YEAR_COLUMN)
);

const growthComp = comparisonMeasureWithBucket(
  "Growth comp. with prev. scenario",
  ComparisonMethod.ABSOLUTE_DIFFERENCE,
  growth,
  new Map(Object.entries(refScenario))
);

export const scenariiMeasures: MeasuresDescription = {
  from: SCENARII_TABLE,
  measures: [amount, sales, growth],
  comparisonMeasures: [growthComp],
};
```

2. Create another file of measures, for example `config/measures/otherTableMeasures.ts`.

3. Then, export all measures of each table from `config/measures/index.ts`.

```
export * from "./scenariiTableMeasures";
export * from "./otherTableMeasures";
```

#### Filters

Go to `config/filters.ts` to define filters.
Set the alias to display in the UI and choose the list order. For example:

```
export const filters = [
  {id: "store_country", alias: "Country"},
  {id: "product_category_name", alias: "Category"}
];
```

# License

(TODO)
