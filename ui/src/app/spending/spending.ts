import {
  BucketColumnSet,
  comparisonMeasureWithBucket, comparisonMeasureWithParent,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  Field,
  from, integer,
  Measure, multiply, PivotConfig,
  Query,
  QueryMerge,
  sum, TableField,
  Year
} from "@squashql/squashql-js"
import {spending} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"

class PercentOfParentMeasure implements Measure {
  readonly alias: string = "% amount on rows"
  readonly class: string = ""
}

const pop = new PercentOfParentMeasure()
const groupOfCountries = new TableField("group of countries")
const countryGroups = new Map(Object.entries({
  "comp. with fr": ["france", "usa", "uk"],
  "comp. with uk": ["uk", "france", "usa"],
  "comp. with usa": ["usa", "france", "uk"],
}))

function createSpendingMeasures(): Measure[] {
  const amount = sum("amount", spending.amount)
  const yoyGrowth = comparisonMeasureWithPeriod(
          "YoY Growth",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.year, "y-1"]]),
          new Year(spending.year))
  const amountComparison = comparisonMeasureWithBucket("group amount comparison",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.country, "first"]]))
  return [amount, yoyGrowth, amountComparison, pop]
}

function createPercentOfParentMeasure(pop: PercentOfParentMeasure, fields: Field[]): Measure {
  const ancestors: Field[] = fields
  const amount = sum("amount", spending.amount)
  const ratio = comparisonMeasureWithParent(pop.alias + "_underlying", ComparisonMethod.DIVIDE, amount, ancestors)
  return multiply(pop.alias, integer(100), ratio)
}

function createSpendingFields(): Field[] {
  return [spending.spendingCategory, spending.spendingSubcategory, spending.continent, spending.country, spending.city, spending.year, groupOfCountries]
}

const spendingFields = createSpendingFields()
const spendingMeasures = createSpendingMeasures()

export class SpendingQueryProvider implements QueryProvider {

  readonly selectableFields = spendingFields
  readonly measures = spendingMeasures

  query(select: Field[], values: Measure[], pivotConfig: PivotConfig): QueryMerge | Query {
    const index = values.indexOf(pop)
    const copy = [...values]
    if (index >= 0) {
      const pop = copy[index]
      copy.splice(index, 1)
      copy.push(createPercentOfParentMeasure(pop, pivotConfig.rows))
    }

    const gocIndex = select.indexOf(groupOfCountries)
    select = select.filter(f => f !== groupOfCountries)
    const columnSets = gocIndex >= 0 ? [new BucketColumnSet(groupOfCountries, spending.country, countryGroups)] : []

    return from(spending._name)
            .select(select, columnSets, copy)
            .build()
  }
}
