This tutorial is based on a simulated [personal budget spreadsheet](src/main/resources/personal_budget.csv) to help analyzing our
hypothetical finances. It contains data only for the first 3 months of 2022 and 2023 to work with a small dataset. If you open it, 
you'll see a column "Scenarios" to illustrate the What-If simulation concept. The "Scenarios" column in the csv file is used to create
the final dataset by exploding the initial dataset where each item in the list is placed into its own row. More details in section 3. 

This is what the final dataset looks like:

```
+--------------------+--------------------+-------------+----+-----+---+----------+--------------------+------+---------------+--------+
|Income / Expenditure|            Category|  Subcategory|Year|Month|Day|      Date|         Description|Amount|Happiness score|Scenario|
+--------------------+--------------------+-------------+----+-----+---+----------+--------------------+------+---------------+--------+
|         Expenditure|Cigarettes & Alcohol|Miscellaneous|2022|    1|  1|01/01/2022|          Cigarettes|   9.3|              2|       b|
|         Expenditure|Cigarettes & Alcohol|Miscellaneous|2022|    1|  1|01/01/2022|          Cigarettes|   9.3|              2|      ss|
|         Expenditure|Cigarettes & Alcohol|Miscellaneous|2022|    1|  1|01/01/2022|          Cigarettes|   9.3|              2|      sm|
|         Expenditure|Cigarettes & Alcohol|Miscellaneous|2022|    1|  1|01/01/2022|          Cigarettes|   9.3|              2|      so|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|       b|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|      ss|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|      sc|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|      sm|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|      so|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|     sco|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|     smc|
|              Income|      Current Income|       Salary|2022|    1|  1|01/01/2022|              Salary|1930.0|           null|    smco|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|       b|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|      ss|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|      sc|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|      sm|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|      so|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|     sco|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|     smc|
|         Expenditure| Minimum expenditure|      Housing|2022|    1|  1|01/01/2022|House rent (with ...|691.16|           null|    smco|
+--------------------+--------------------+-------------+----+-----+---+----------+--------------------+------+---------------+--------+
```

You'll have to write some code using the [Typescript library](https://www.npmjs.com/package/@squashql/squashql-js).
Write the code in the file index.ts (Full path = `ts/src/index.ts`). You'll be asked to execute queries. Here's code snippet
showing you how to execute a query and print the result in the console once the server is up. 

The name of the table is **budget**. The file `tables.ts` contains a class `Budget` with [type definitions](https://github.com/squashql/squashql-codegen) that represents
tables and fields of the budget table.

```typescript
import {from, Querier,} from "@squashql/squashql-js"
import {budget} from "./tables"

const querier = new Querier("http://localhost:8080")
const query = from(budget._name)
        .// TODO continue to edit the query
querier.execute(query, undefined, true)
        .then(r => console.log(r));
```

Please refer as mush as possible to the [Typescript library documentation](https://github.com/squashql/squashql/blob/main/documentation/QUERY.md).

## Set up the project

### Locally

You can either start the server locally if you have setup a development environment. See the README.md at the root of this project to install 
all the prerequisites. 

### Codespaces

Alternatively you can use Codespaces, a service provided by GitHub to setup a development environment hosted in the cloud, it's free you only need a GitHub account.
Click on [this link](https://github.com/codespaces/new?machine=basicLinux32gb&repo=580807210&ref=main&location=WestEurope&devcontainer_path=.devcontainer%2Fdevcontainer.json) to start
using Codespaces. Then click on *Create codespace*. It will take a few minutes to set everything up.

In the terminal:
```bash
mvn spring-boot:run
```
It will download all dependencies and launch the server. If everything works as expected, you should see this in the console output
```
2023-02-28 10:44:01.807  INFO 2678 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2023-02-28 10:44:01.822  INFO 2678 --- [main] io.squashql.ShowcaseApplication          : Started ShowcaseApplication in 10.332 seconds (JVM running for 11.514)
```

Open the file `ts/src/index.ts` and start editing it by following the instructions below. To run the file index.ts, open a new terminal 
and execute
```bash
npm --prefix ts/ start
```

Note: Once you finish the tutorial, don't forget to [stop your Codespace](https://docs.github.com/en/codespaces/developing-in-codespaces/deleting-a-codespace).

## Basic queries and calculations  
Create a measure that computes the income.

<details><summary>Hint</summary>

Use the `sumIf` aggregation function with a criterion on Income / Expenditure column.
</details>
<details><summary>Code</summary>

```typescript
const income = sumIf("Income", budget.amount, criterion(budget.incomeOrExpenditure, eq("Income")))
```
</details>

Create a measure that computes the expenditure.

<details><summary>Hint</summary>

Use the `sumIf` aggregation function with a criterion on Income / Expenditure column.
</details>
<details><summary>Code</summary>

```typescript
const expenditure = sumIf("Expenditure", budget.amount, criterion(budget.incomeOrExpenditure, neq("Income")))
```
</details>

Create and execute a query that shows by year, month and category with a filter on the scenario named "b" the income and expenditure
values side by side.

<details><summary>Hint</summary>

Filter the table with `criterion(budget.scenario, eq("b"))`
</details>

<details><summary>Code</summary>

```typescript
const query = from("budget")
        .where(criterion(budget.scenario, eq("b")))
        .select([budget.year, budget.month, budget.category], [], [income, expenditure])
        .build()
```
</details>
<details><summary>Result</summary>

```
+------+-------+---------------------------------+--------+--------------------+
| Year | Month |                        Category | Income |        Expenditure |
+------+-------+---------------------------------+--------+--------------------+
| 2022 |     1 |            Cigarettes & Alcohol |   null | 54.870000000000005 |
| 2022 |     1 |                  Current Income | 1930.0 |               null |
| 2022 |     1 | Media & Clothes & Food Delivery |   null |             118.75 |
| 2022 |     1 |             Minimum expenditure |   null |            1383.87 |
| 2022 |     1 |                Outing Lifestyle |   null |             141.38 |
| 2022 |     1 |             Sport & Game & misc |   null | 124.17000000000002 |
| 2022 |     2 |            Cigarettes & Alcohol |   null |              58.59 |
| 2022 |     2 |                  Current Income | 1930.0 |               null |
| 2022 |     2 | Media & Clothes & Food Delivery |   null | 202.22000000000003 |
| 2022 |     2 |             Minimum expenditure |   null | 1389.7999999999997 |
| 2022 |     2 |                Outing Lifestyle |   null |             149.75 |
| 2022 |     2 |             Sport & Game & misc |   null |             120.57 |
| 2022 |     3 |            Cigarettes & Alcohol |   null |              48.36 |
| 2022 |     3 |                  Current Income | 1930.0 |               null |
| 2022 |     3 | Media & Clothes & Food Delivery |   null |              72.94 |
| 2022 |     3 |             Minimum expenditure |   null |            1385.33 |
| 2022 |     3 |                Outing Lifestyle |   null | 218.57000000000005 |
| 2022 |     3 |             Sport & Game & misc |   null |             130.57 |
| 2023 |     1 |            Cigarettes & Alcohol |   null |               59.0 |
| 2023 |     1 |                  Current Income | 2010.0 |               null |
| 2023 |     1 | Media & Clothes & Food Delivery |   null |              127.0 |
| 2023 |     1 |             Minimum expenditure |   null |             1471.5 |
| 2023 |     1 |                Outing Lifestyle |   null |              152.0 |
| 2023 |     1 |             Sport & Game & misc |   null |              129.0 |
| 2023 |     2 |            Cigarettes & Alcohol |   null |               63.0 |
| 2023 |     2 |                  Current Income | 2010.0 |               null |
| 2023 |     2 | Media & Clothes & Food Delivery |   null |              216.0 |
| 2023 |     2 |             Minimum expenditure |   null |             1471.5 |
| 2023 |     2 |                Outing Lifestyle |   null |              161.0 |
| 2023 |     2 |             Sport & Game & misc |   null |              124.0 |
| 2023 |     3 |            Cigarettes & Alcohol |   null |               52.0 |
| 2023 |     3 |                  Current Income | 2010.0 |               null |
| 2023 |     3 | Media & Clothes & Food Delivery |   null |               77.0 |
| 2023 |     3 |             Minimum expenditure |   null |             1471.5 |
| 2023 |     3 |                Outing Lifestyle |   null |              235.0 |
| 2023 |     3 |             Sport & Game & misc |   null |              134.0 |
+------+-------+---------------------------------+--------+--------------------+
```
</details>

Create a measure that computes the net income i.e. the difference between income and expenditure and then execute a query 
to show the net income for each month of the year. Keeps on filtering on the scenario named "b".

<details><summary>Hint</summary>

Use the `minus` operator to compute the difference.

</details>
<details><summary>Code</summary>

```typescript
const netIncome = minus("Net income", income, expenditure)
const query = from("budget")
        .where(criterion(budget.scenario, eq("b")))
        .select([budget.year, budget.month], [], [netIncome])
        .build()
```
</details>
<details><summary>Result</summary>

```
+------+-------+--------------------+
| Year | Month |         Net income |
+------+-------+--------------------+
| 2022 |     1 | 106.96000000000026 |
| 2022 |     2 |  9.070000000000391 |
| 2022 |     3 |  74.23000000000047 |
| 2023 |     1 |               71.5 |
| 2023 |     2 |              -25.5 |
| 2023 |     3 |               40.5 |
+------+-------+--------------------+
```
</details>

Try to `rollup` on "Year", "Month" to add totals and subtotals to the result. Rollup on Month only to remove the Grand Total.  
<details><summary>Code</summary>

```typescript
const query = from(budget._name)
        .where(criterion(budget.scenario, eq("b")))
        .select([budget.year, budget.month], [], [netIncome])
        .rollup([budget.year, budget.month])
        .build()
```
</details>
<details><summary>Result</summary>

```
+-------------+-------------+--------------------+
|        Year |       Month |         Net income |
+-------------+-------------+--------------------+
| Grand Total | Grand Total | 276.75999999999476 |
|        2022 |       Total | 190.25999999999476 |
|        2022 |           1 | 106.96000000000026 |
|        2022 |           2 |  9.070000000000391 |
|        2022 |           3 |  74.23000000000047 |
|        2023 |       Total |               86.5 |
|        2023 |           1 |               71.5 |
|        2023 |           2 |              -25.5 |
|        2023 |           3 |               40.5 |
+-------------+-------------+--------------------+
```
</details>

## Time-series comparison

Create a measure that computes the Net Income growth. The calculation is a given year's net income minus the prior year's net income, divided by the prior year's net income.
A comparison can use different type of comparison method. In our case, we can use `ComparisonMethod.RELATIVE_DIFFERENCE`.

<details><summary>Hint</summary>

Use the `comparisonMeasureWithPeriod` to create the comparison measure.
</details>
<details><summary>Code</summary>

```typescript
const netIncomeGrowth = comparisonMeasureWithPeriod(
        "Net Income growth (prev. year)",
        ComparisonMethod.RELATIVE_DIFFERENCE,
        netIncome,
        new Map(Object.entries({ ["Year"]: "y-1" })),
        new Year("Year")
)
```
</details>

Execute a query that shows the Net Income Growth for each year.

<details><summary>Result</summary>

```typescript      
const query = from("budget")
        .where(criterion("Scenario", eq("b")))
        .select(["Year"], [], [netIncome, netIncomeGrowth])
        .build()
```

```
+------+--------------------+--------------------------------+
| Year |         Net Income | Net Income growth (prev. year) |
+------+--------------------+--------------------------------+
| 2022 | 190.25999999999476 |                           null |
| 2023 |               86.5 |            -0.5453589824450626 |
+------+--------------------+--------------------------------+
```
This result shows us we have spent more money in 2023 than in 2022.
</details>

## Dynamic bucketing

Dynamic bucketing refers to a technique used to group or categorize aggregate values into discrete bins or buckets based 
on the characteristics of the values themselves, rather than predefined static bin boundaries. This approach is particularly
useful when dealing with numerical or continuous data that may have a wide range of values and varied distributions.

Once you determine the boundaries of your buckets, you then apply these dynamically computed bins to the data, assigning 
each value to the appropriate bucket. This can be done with SquashQL by using a [virtual table](https://github.com/squashql/squashql/blob/main/documentation/QUERY.md#joining-on-virtual-created-on-the-fly-at-query-time)
that can be joined to another table, the one containing your data. The fields of this virtual table can then be used are 
regular fields in the query on which group by clause can be applied. 

Let's illustrate this concept with a simple example. The *happiness score* is a rating of 1 through 5 that we arbitrary 
set to assess how much an expenditure affect (in a positive way) our well-being. Try to execute the following query

```typescript
const expenditure = sumIf("Expenditure", budget.amount, criterion(budget.incomeOrExpenditure, neq("Income")))
const query = from(budget._name)
        .where(
                all([
                  criterion(budget.scenario, eq("b")),
                  criterion(budget.year, eq(2023)),
                ]))
        .select([budget.year, budget.score], [], [expenditure])
        .build()
```

<details><summary>Result</summary>

```
+------+-----------------+-------------+
| Year | Happiness score | Expenditure |
+------+-----------------+-------------+
| 2023 |               0 |      4984.5 |
| 2023 |               1 |       176.0 |
| 2023 |               2 |       177.0 |
| 2023 |               3 |        81.0 |
| 2023 |               4 |       525.0 |
+------+-----------------+-------------+
```
This result shows for the year 2023 the distribution of the expenses. Notice how filters have been combined by using `all`.  
</details>

Instead of using Happiness score, we can classify each expense into buckets that define satisfaction levels as follows:

| satisfaction level | lower bound | upper bound |
|--------------------|-------------|-------------|
| neutral            | 0           | 2           |
| happy              | 2           | 4           |
| very happy         | 4           | 5           |

And use this column, satisfaction level, for our analysis. 

Let's first define the virtual table in Typescript:
```typescript
import {VirtualTable} from "@squashql/squashql-js/dist/virtualtable";
import {satisfactionLevels} from "./tables";

const records = [
  ["neutral", 0, 2],
  ["happy", 2, 4],
  ["very happy", 4, 5],
];
const satisfactionLevelsVT = new VirtualTable(
        satisfactionLevels._name,
        [
          satisfactionLevels.satisfactionLevel.fieldName,
          satisfactionLevels.lowerBound.fieldName,
          satisfactionLevels.upperBound.fieldName
        ], records)
```

that can be joined to the table with a criteria (non-equi join) to associate a bucket to a given row based on the Happiness
score value. The table is not materialized anywhere and exists only during the execution time of the query. Due to the 
condition types used here, the lower bound is inclusive and the upper bound is exclusive.

```typescript
const query = from(budget._name)
        .joinVirtual(satisfactionLevelsVT, JoinType.INNER)
        .on(all([
          criterion_(budget.score, satisfactionLevels.lowerBound, ConditionType.GE),
          criterion_(budget.score, satisfactionLevels.upperBound, ConditionType.LT)
        ]))
        .where(
                all([
                  criterion(budget.scenario, eq("b")),
                  criterion(budget.year, eq(2023)),
                ]))
        .select([budget.year, satisfactionLevels.satisfactionLevel], [], [expenditure])
        .build()
```

<details><summary>Result</summary>

```
+------+--------------------+-------------+
| Year | satisfaction_level | Expenditure |
+------+--------------------+-------------+
| 2023 |              happy |       258.0 |
| 2023 |            neutral |      5160.5 |
| 2023 |         very happy |       525.0 |
+------+--------------------+-------------+
```
</details>

Try to change the boundaries or add new levels.

## What-if comparison

To illustrate the concept of What-If simulations, the column named "Scenarios" contains for each 
row a list of scenario codes.
The Base scenario (code `b`) represents the current situation from which scenarios are derived. For instance,
the scenario with code `ss` means we stop all activities related to the category **Sport & Game & misc**.

| Code | Full name / Category                                                           |
|------|--------------------------------------------------------------------------------|
| b    | Base                                                                           |
| ss   | Stop Sport & Game & misc                                                       |
| sc   | Stop Cigarettes & Alcohol                                                      |
| sm   | Stop Media & Clothes & Food Delivery                                           |
| so   | Stop Outing Lifestyle                                                          |
| sco  | Stop Outing Lifestyle & Cigarettes & Alcohol                                   |
| smc  | Stop Media & Clothes & Food Delivery & Cigarettes & Alcohol                    |
| smco | Stop Media & Clothes & Food Delivery & Cigarettes & Alcohol & Outing Lifestyle |

Execute the following query: 
```typescript
const query = from(budget._name)
        .select([budget.scenario, budget.year], [], [netIncome])
        .build()
```

It shows the Net Income for each scenario and for each year. Apply a filter on 2023 to focus on the current year. We can
remove "Year" from the query. You should have something like this:

<details><summary>Code</summary>

```typescript
const query = from(budget._name)
        .where(criterion(budget.year, eq(2023)))
        .select([budget.scenario], [], [netIncome])
        .build()
```
</details>

<details><summary>Result</summary>

```
+----------+------------+
| Scenario | Net income |
+----------+------------+
|        b |       86.5 |
|       sc |      260.5 |
|      sco |      808.5 |
|       sm |      506.5 |
|      smc |      680.5 |
|     smco |     1228.5 |
|       so |      634.5 |
|       ss |      473.5 |
+----------+------------+
```
</details>

Let's create groups of scenarios. Each group determines which scenarios will be compared to. 

```typescript
const groups = new Map(Object.entries({
  "group1": ["b", "sc", "sco"],
  "group2": ["b", "sm", "smc", "smco"],
  "group3": ["b", "so", "sco", "smco"],
  "group4": ["b", "ss"],
}))
```

The groups are simply map. The keys are group name and values are the list of scenario names. A scenario 
can be in multiple groups. We use this map to create a [ColumnSet](https://github.com/squashql/squashql/blob/main/documentation/QUERY.md#dynamic-comparison---what-if---columnset).

```typescript
import {budget} from "./tables";

const columnSet = new BucketColumnSet(new TableField("group"), budget.scenario, groups)
```

Execute the following query containing the previously defined column set. Notice you do not need to add the Scenario column
to the query, it is added automatically by using `columnSet`. Adding it to the query will make a new column and new rows appear

<details open><summary>Code</summary>

```typescript
import {budget} from "./tables";

const query = from(budget._name)
    .where(criterion(budget.year, eq(2023)))
    .select([], [columnSet], [netIncome])
    .build()
```

</details>
<details><summary>Result</summary>

```
+--------+----------+------------+
|  group | Scenario | Net income |
+--------+----------+------------+
| group1 |        b |       86.5 |
| group1 |       sc |      260.5 |
| group1 |      sco |      808.5 |
| group2 |        b |       86.5 |
| group2 |       sm |      506.5 |
| group2 |      smc |      680.5 |
| group2 |     smco |     1228.5 |
| group3 |        b |       86.5 |
| group3 |       so |      634.5 |
| group3 |      sco |      808.5 |
| group3 |     smco |     1228.5 |
| group4 |        b |       86.5 |
| group4 |       ss |      473.5 |
+--------+----------+------------+
```
</details>

Among a given group, we need to compare the value of Net Income with the value of the previous scenario.
There's a built-in measure to perform such calculation and the definition of "previous scenario" is similar to the one 
used to express "previous year" we saw earlier.

<details><summary>Hint</summary>

Use the `comparisonMeasureWithBucket` to create the comparison measure.
</details>
<details><summary>Code</summary>

```typescript
const netIncomeCompPrev = comparisonMeasureWithBucket(
        "Net Income comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map([[budget.scenario, "s-1"]]))
```
</details>

Add to the previous query this new measure.

<details><summary>Result</summary>

```typescript      
const query = from(budget._name)
        .where(criterion(budget.year, eq(2023)))
        .select([], [columnSet], [netIncome, netIncomeCompPrev])
        .build()
```

```
+--------+----------+------------+--------------------------------------+
|  group | Scenario | Net income | Net Income comp. with prev. scenario |
+--------+----------+------------+--------------------------------------+
| group1 |        b |       86.5 |                                  0.0 |
| group1 |       sc |      260.5 |                                174.0 |
| group1 |      sco |      808.5 |                                548.0 |
| group2 |        b |       86.5 |                                  0.0 |
| group2 |       sm |      506.5 |                                420.0 |
| group2 |      smc |      680.5 |                                174.0 |
| group2 |     smco |     1228.5 |                                548.0 |
| group3 |        b |       86.5 |                                  0.0 |
| group3 |       so |      634.5 |                                548.0 |
| group3 |      sco |      808.5 |                                174.0 |
| group3 |     smco |     1228.5 |                                420.0 |
| group4 |        b |       86.5 |                                  0.0 |
| group4 |       ss |      473.5 |                                387.0 |
+--------+----------+------------+--------------------------------------+
```
</details>

To save the most money, the scenario *smco* is unsurprisingly (because we cut a lot of costs) the most interesting. 
However, the saved amount is not be the only criteria to decide which scenario is the best: we have to use the *happiness score*
(see the data) to help us decide. The *happiness score* is a rating of 1 through 5 that we arbitrary set to assess how much 
an expenditure affect (in a positive way) our well-being. 

Create a measure that aggregates Happiness score values with the sum function and use it to create a comparison measure 
in the same way *Net Income comp. with prev. scenario* has been done.

<details><summary>Code</summary>

```typescript
const happiness = sum("Happiness score sum", budget.score);
const happinessCompPrev = comparisonMeasureWithBucket(
        "Happiness score sum comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map([[budget.scenario, "s-1"]]))
```
</details>

Add them to the previous query.

<details><summary>Result</summary>

```typescript      
const query = from(budget._name)
        .where(criterion(budget.year, eq(2023)))
        .select([budget.year], [columnSet], [netIncome, happiness,  netIncomeCompPrev, happinessCompPrev])
        .build()
```

```
+--------+----------+------+------------+---------------------+--------------------------------------+-----------------------------------------------+
|  group | Scenario | Year | Net income | Happiness score sum | Net Income comp. with prev. scenario | Happiness score sum comp. with prev. scenario |
+--------+----------+------+------------+---------------------+--------------------------------------+-----------------------------------------------+
| group1 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                             0 |
| group1 |       sc | 2023 |      260.5 |                 108 |                                174.0 |                                           -24 |
| group1 |      sco | 2023 |      808.5 |                  95 |                                548.0 |                                           -13 |
| group2 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                             0 |
| group2 |       sm | 2023 |      506.5 |                  70 |                                420.0 |                                           -62 |
| group2 |      smc | 2023 |      680.5 |                  46 |                                174.0 |                                           -24 |
| group2 |     smco | 2023 |     1228.5 |                  33 |                                548.0 |                                           -13 |
| group3 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                             0 |
| group3 |       so | 2023 |      634.5 |                 119 |                                548.0 |                                           -13 |
| group3 |      sco | 2023 |      808.5 |                  95 |                                174.0 |                                           -24 |
| group3 |     smco | 2023 |     1228.5 |                  33 |                                420.0 |                                           -62 |
| group4 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                             0 |
| group4 |       ss | 2023 |      473.5 |                  99 |                                387.0 |                                           -33 |
+--------+----------+------+------------+---------------------+--------------------------------------+-----------------------------------------------+
```
</details>

Create two new comparison measures to compare Net Income and Happiness score values to the first scenario
of each group instead of the previous scenario.

<details><summary>Hint</summary>

Use the `first` keyword in `{["Scenario"]: "s-1"}` to change the reference position with which a value is compared to. 
</details>
<details><summary>Code</summary>

```typescript
const netIncomeCompFirst = comparisonMeasureWithBucket(
        "Net Income comp. with first scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map([[budget.scenario, "first"]]))
const happinessCompFirst = comparisonMeasureWithBucket(
        "Happiness score sum comp. with first scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map([[budget.scenario, "first"]]))
```
</details>

Add them to the previous query.

<details><summary>Result</summary>

```typescript      
const query = from(budget._name)
        .where(criterion(budget.year, eq(2023)))
        .select([budget.year], [columnSet], [netIncome, happiness, netIncomeCompPrev, netIncomeCompFirst, happinessCompPrev, happinessCompFirst])
        .build()
```

```
+--------+----------+------+------------+---------------------+--------------------------------------+--------------------------------------+-----------------------------------------------+-----------------------------------------------+
|  group | Scenario | Year | Net income | Happiness score sum | Net Income comp. with prev. scenario | Net Income comp. with first scenario | Happiness score sum comp. with prev. scenario | Happiness score sum comp. with first scenario |
+--------+----------+------+------------+---------------------+--------------------------------------+--------------------------------------+-----------------------------------------------+-----------------------------------------------+
| group1 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                  0.0 |                                             0 |                                             0 |
| group1 |       sc | 2023 |      260.5 |                 108 |                                174.0 |                                174.0 |                                           -24 |                                           -24 |
| group1 |      sco | 2023 |      808.5 |                  95 |                                548.0 |                                722.0 |                                           -13 |                                           -37 |
| group2 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                  0.0 |                                             0 |                                             0 |
| group2 |       sm | 2023 |      506.5 |                  70 |                                420.0 |                                420.0 |                                           -62 |                                           -62 |
| group2 |      smc | 2023 |      680.5 |                  46 |                                174.0 |                                594.0 |                                           -24 |                                           -86 |
| group2 |     smco | 2023 |     1228.5 |                  33 |                                548.0 |                               1142.0 |                                           -13 |                                           -99 |
| group3 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                  0.0 |                                             0 |                                             0 |
| group3 |       so | 2023 |      634.5 |                 119 |                                548.0 |                                548.0 |                                           -13 |                                           -13 |
| group3 |      sco | 2023 |      808.5 |                  95 |                                174.0 |                                722.0 |                                           -24 |                                           -37 |
| group3 |     smco | 2023 |     1228.5 |                  33 |                                420.0 |                               1142.0 |                                           -62 |                                           -99 |
| group4 |        b | 2023 |       86.5 |                 132 |                                  0.0 |                                  0.0 |                                             0 |                                             0 |
| group4 |       ss | 2023 |      473.5 |                  99 |                                387.0 |                                387.0 |                                           -33 |                                           -33 |
+--------+----------+------+------------+---------------------+--------------------------------------+--------------------------------------+-----------------------------------------------+-----------------------------------------------+
```
</details>

Notice how stopping Media & Clothes & Food Delivery affects the happiness score: -62 for a saving of 420. Is it worth it?

## Pivot Table

[The documentation is available here](https://github.com/squashql/squashql##pivot-table-query)

A pivot table is a powerful tool to calculate, summarize, and analyze data that lets you see comparisons, patterns, and trends in your data.  
SquashQL has the capability of providing the necessary information to build pivot table. Let's go back to the first query:

```typescript
const query = from(budget._name)
        .where(criterion(budget.scenario, eq("b")))
        .select([budget.year, budget.month, budget.category], [], [expenditure])
        .build()
```

The displayed table is hard to analyze. By using the pivot table feature of SquashQL, we can change the layout of the result 
and display Year and Month on rows and Category on columns:

```typescript
const pivotConfig = {rows: [budget.year, budget.month], columns: [budget.category]};
querier.execute(query, pivotConfig, true).then(r => console.log(r));
```

Note: if you use VSCode, line in Terminal are wrapped leading to printing an unreadable pivot table. To fix it, right click
in the Terminal and click on "Toggle Size to Content Width". Table should look like this.

```
+-------------+-------------+--------------------+----------------------+----------------+---------------------------------+---------------------+--------------------+---------------------+
|    Category |    Category |        Grand Total | Cigarettes & Alcohol | Current Income | Media & Clothes & Food Delivery | Minimum expenditure |   Outing Lifestyle | Sport & Game & misc |
|        Year |       Month |        Expenditure |          Expenditure |    Expenditure |                     Expenditure |         Expenditure |        Expenditure |         Expenditure |
+-------------+-------------+--------------------+----------------------+----------------+---------------------------------+---------------------+--------------------+---------------------+
| Grand Total | Grand Total | 11543.240000000005 |   335.82000000000005 |            NaN |                          813.91 |   8573.500000000002 |             1057.7 |              762.31 |
|        2022 |       Total |  5599.740000000005 |   161.82000000000002 |            NaN |              393.90999999999997 |   4159.000000000002 |              509.7 |              375.31 |
|        2022 |           1 | 1823.0399999999997 |   54.870000000000005 |            NaN |                          118.75 |             1383.87 |             141.38 |  124.17000000000002 |
|        2022 |           2 | 1920.9299999999996 |                58.59 |            NaN |              202.22000000000003 |  1389.7999999999997 |             149.75 |              120.57 |
|        2022 |           3 | 1855.7699999999995 |                48.36 |            NaN |                           72.94 |             1385.33 | 218.57000000000005 |              130.57 |
|        2023 |       Total |             5943.5 |                174.0 |            NaN |                           420.0 |              4414.5 |              548.0 |               387.0 |
|        2023 |           1 |             1938.5 |                 59.0 |            NaN |                           127.0 |              1471.5 |              152.0 |               129.0 |
|        2023 |           2 |             2035.5 |                 63.0 |            NaN |                           216.0 |              1471.5 |              161.0 |               124.0 |
|        2023 |           3 |             1969.5 |                 52.0 |            NaN |                            77.0 |              1471.5 |              235.0 |               134.0 |
+-------------+-------------+--------------------+----------------------+----------------+---------------------------------+---------------------+--------------------+---------------------+
```

The result can be displayed in the browser. Use the function `showInBrowser` from `./utils.ts`. It uses [S2 library](https://s2.antv.vision/en) created by AntV.

```typescript
import {showInBrowser} from "./utils"

querier.execute(query, pivotConfig)
        .then(r => {
          showInBrowser(<PivotTableQueryResult>r)
        })
```

The output is a clickable link. Click on it to open a web page that displays the pivot table.
```
http://localhost:8080
```

<details><summary>Full code</summary>

```typescript
import {
  PivotTableQueryResult,
  Querier, criterion, eq, from, neq, sumIf,
} from "@squashql/squashql-js"
import { showInBrowser } from "./utils"

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
```
</details>


You should see the following table:
<img width="1254" alt="Screenshot 2023-07-18 at 5 41 05 PM" src="https://github.com/squashql/squashql-showcase/assets/5783183/dd576a38-2f3c-4e75-9831-0b5885dd1f7d">

