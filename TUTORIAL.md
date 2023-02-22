This tutorial is based on a simulated [personal budget spreadsheet](src/main/resources/personal_budget_v3.csv) to help analyzing our finances. It contains 
data only for the first 3 months of 2022 and 2023 to work with a small dataset. If you open it, 
you'll see a column "Scenarios" to illustrate the What-If simulation concept in section 3.

## Basic queries and calculations  
Create a measure that computes the income.

<details><summary>Hint</summary>
<p>
Use the sumIf aggregation function with a criterion on Income / Expenditure column.
</p>
</details>
<details><summary>Code</summary>

```typescript
const income = sumIf("Income", "Amount", criterion("Income / Expenditure", eq("Income")))
```
</details>

Create a measure that computes the expenditure.

<details><summary>Hint</summary>
<p>
Use the sumIf aggregation function with a criterion on Income / Expenditure column.
</p>
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
The Base scenario (code `b`) represents the current situation. Other scenarios represent 

| Code | Full name                                                                      |
|------|--------------------------------------------------------------------------------|
| b    | Base                                                                           |
| ss   | Stop Sport & Game & misc                                                       |
| sc   | Stop Cigarettes & Alcohol                                                      |
| sm   | Stop Media & Clothes & Food Delivery                                           |
| so   | Stop Outing Lifestyle                                                          |
| sco  | Stop Outing Lifestyle & Cigarettes & Alcohol                                   |
| smc  | Stop Media & Clothes & Food Delivery & Cigarettes & Alcohol                    |
| smco | Stop Media & Clothes & Food Delivery & Cigarettes & Alcohol & Outing Lifestyle |
