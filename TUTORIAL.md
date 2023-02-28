This tutorial is based on a simulated [personal budget spreadsheet](src/main/resources/personal_budget_v3.csv) to help analyzing our
hypothetical finances. It contains data only for the first 3 months of 2022 and 2023 to work with a small dataset. If you open it, 
you'll see a column "Scenarios" to illustrate the What-If simulation concept in section 3.

You'll have to write some code using the [Typescript library](https://www.npmjs.com/package/@squashql/squashql-js).
Write the code in the file index.ts (Full path = `ts/src/index.ts`). You'll be asked to execute queries. Here's code snippet
showing you how to execute a query and print the result in the console once the server is up. 

```typescript
import {
  Querier,
} from "@squashql/squashql-js"

const querier = new Querier("http://localhost:8080")
const query = undefined // TO BE DEFINED
querier.execute0(query)
        .then(r => console.log(r));
```

## Setup the project

### Locally

You can either start the server locally if you have setup a development environment. See the README.md at the root of this project to install 
all the prerequisites. 

### Codespaces

Alternatively you can use Codespaces, a service provided by GitHub to setup a development environment hosted in the cloud, it's free you only need a GitHub account.
Click on [this link](https://github.com/codespaces/new?machine=basicLinux32gb&repo=580807210&ref=showcase-ts&location=WestEurope&devcontainer_path=.devcontainer%2Fdevcontainer.json) to start
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

Note: Once you finish the tutorial, don't forget to stop your Codespace.

## Basic queries and calculations  
Create a measure that computes the income.

<details><summary>Hint</summary>

Use the `sumIf` aggregation function with a criterion on Income / Expenditure column.
</details>
<details><summary>Code</summary>

```typescript
const income = sumIf("Income", "Amount", criterion("Income / Expenditure", eq("Income")))
```
</details>

Create a measure that computes the expenditure.

<details><summary>Hint</summary>

Use the `sumIf` aggregation function with a criterion on Income / Expenditure column.
</details>
<details><summary>Code</summary>

```typescript
const expenditure = sumIf("Expenditure", "Amount", criterion("Income / Expenditure", neq("Income")))
```
</details>

Create and execute a query that shows by year, month and category with a filter on the scenario named "base" the income and expenditure
values side by side.

<details><summary>Code</summary>

```typescript
const query = from("budget")
        .where(criterion("Scenario", eq("b")))
        .select(["Year", "Month", "Category"], [], [income, expenditure])
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
to show the net income for each month of the year. Keeps on filtering on the scenario named "base".

<details><summary>Hint</summary>
<p>
Use the `minus` operator to compute the difference.
</p>
</details>
<details><summary>Code</summary>

```typescript
const netIncome = minus("Net income", income, expenditure)
const query = from("budget")
        .where(criterion("Scenario", eq("b")))
        .select(["Year", "Month"], [], [netIncome])
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
const query = from("budget")
        .where(criterion("Scenario", eq("b")))
        .select(["Year", "Month"], [], [netIncome])
        .rollup(["Year", "Month"])
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

Create a measure that computes the Net Income growth. This measure compares the Net Income values for each month with 
values of the same month but the previous year i.e. the measure should compare the values of Net Income for (Year = 2023, Month = 3) 
with (Year = 2022, Month = 3), (Year = 2023, Month = 2) with (Year = 2022, Month = 2), ...

A comparison can use different type of comparison method. In our case, we can use `ComparisonMethod.RELATIVE_DIFFERENCE`.

<details><summary>Hint</summary>
<p>
Use the `comparisonMeasureWithPeriod` to create the comparison measure.
</p>
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

Execute a query that shows the Net Income Growth for each month.

<details><summary>Result</summary>

```typescript      
const query = from("budget")
        .where(criterion("Scenario", eq("b")))
        .select(["Year", "Month"], [], [netIncome, netIncomeGrowth])
        .build()
```

```
+------+-------+--------------------+--------------------------------+
| Year | Month |         Net income | Net Income growth (prev. year) |
+------+-------+--------------------+--------------------------------+
| 2022 |     1 | 106.96000000000026 |                           null |
| 2022 |     2 |  9.070000000000391 |                           null |
| 2022 |     3 |  74.23000000000047 |                           null |
| 2023 |     1 |               71.5 |            -0.3315258040388947 |
| 2023 |     2 |              -25.5 |              -3.81146637265699 |
| 2023 |     3 |               40.5 |           -0.45439849117607783 |
+------+-------+--------------------+--------------------------------+
```
This result shows us we have spent more money in 2023 than in 2022.
</details>

## What-if comparison

To illustrate the concept of What-If simulations, the column named "Scenarios" contains for each 
row a list of scenario codes.
The Base scenario (code `b`) represents the current situation from which scenarios are derived. For instance,
the scenario with code `ss` means we stop all activities related to the category **Stop Sport & Game & misc**. 
The "Scenarios" column is used to create the final rowset by exploding the initial rowset where each item in the 
list is placed into its own row.

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
const query = from("budget")
        .select(["Scenario", "Year"], [], [netIncome])
        .build()
```

It shows the Net Income for each scenario and for each year. Apply a filter on 2023 to focus on the current year. We can
remove "Year" from the query. You should have something like this:

<details><summary>Code</summary>

```typescript
const query = from("budget")
        .where(criterion("Year", eq(2023)))
        .select(["Scenario"], [], [netIncome])
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
can be in multiple groups. We use this map to create a [ColumnSet](https://github.com/squashql/squashql/blob/main/QUERY.md#dynamic-comparison---what-if---columnset).

```typescript
const columnSet = new BucketColumnSet("group", "Scenario", groups)
```

Execute the following query containing the previously defined column set. Adding it to the query will make a new column and new rows appear

<details><summary>Code</summary>

```typescript
const query = from("budget")
  .where(criterion("Year", eq(2023)))
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

Among a given group, we need to compare the value of Net Income growth (prev. year) with the value of the previous scenario.
There's a built-in measure to perform such calculation and the definition of "previous scenario" is similar to the one 
used to express "previous year" we saw earlier.

<details><summary>Hint</summary>
<p>
Use the `comparisonMeasureWithBucket` to create the comparison measure.
</p>
</details>
<details><summary>Code</summary>

```typescript
const netIncomeComp = comparisonMeasureWithBucket(
        "Net Income comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        netIncome,
        new Map(Object.entries({["Scenario"]: "s-1"})))
```
</details>

Add to the previous query this new measure.

<details><summary>Result</summary>

```typescript      
const query = from("budget")
        .where(criterion("Year", eq(2023)))
        .select([], [columnSet], [netIncome, netIncomeComp])
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
const happiness = sum("Happiness score sum", "Happiness score");
const happinessComp = comparisonMeasureWithBucket(
        "Happiness score sum comp. with prev. scenario",
        ComparisonMethod.ABSOLUTE_DIFFERENCE,
        happiness,
        new Map(Object.entries({["Scenario"]: "s-1"})))
```
</details>

Add them to the previous query.

<details><summary>Result</summary>

```typescript      
const query = from("budget")
        .where(criterion("Year", eq(2023)))
        .select(["Year"], [columnSet], [netIncome, happiness,  netIncomeComp, happinessComp])
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

Notice how stopping Media & Clothes & Food Delivery affects the happiness score: -62 for a saving of 420. Is it worth it?
