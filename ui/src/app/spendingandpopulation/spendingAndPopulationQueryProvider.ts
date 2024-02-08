import {
  AliasedField,
  BucketColumnSet,
  comparisonMeasureWithBucket,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  Field,
  from,
  JoinType,
  Measure,
  Query,
  QueryMerge,
  sum,
  TableField,
  Year
} from "@squashql/squashql-js"
import {population, spending} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"

const continent = new AliasedField("continent")
const country = new AliasedField("country")
const groupOfCountries = new TableField("group of countries")
const countryGroups = new Map(Object.entries({
  "comp. with fr": ["france", "usa", "uk"],
  "comp. with uk": ["uk", "france", "usa"],
  "comp. with usa": ["usa", "france", "uk"],
}))

function createPopulationMeasures(): Measure[] {
  const pop = sum("population", population.population)
  return [pop]
}

function createSpendingMeasures(): Measure[] {
  const amount = sum("amount", spending.amount)
  const yoyGrowth = comparisonMeasureWithPeriod(
          "YoY Growth",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.year, "y-1"]]),
          new Year(spending.year))
  const amountComparison = comparisonMeasureWithBucket("amount comparison",
          ComparisonMethod.ABSOLUTE_DIFFERENCE,
          amount,
          new Map([[spending.country.as(country.alias), "first"]]))
  return [amount, yoyGrowth, amountComparison]
}

function createSpendingFields(): Field[] {
  return [spending.spendingCategory, spending.spendingSubcategory, spending.city, spending.year, continent, country, groupOfCountries]
}

function createPopulationFields(): Field[] {
  return [continent, country]
}

const spendingFields = createSpendingFields()
const spendingMeasures = createSpendingMeasures()
const populationFields = createPopulationFields()
const populationMeasures = createPopulationMeasures()

export class SpendingAndPopulationQueryProvider implements QueryProvider {

  readonly selectableFields = spendingFields.concat(populationFields).filter((value, index, array) => array.indexOf(value) === index)
  readonly measures = spendingMeasures.concat(populationMeasures)

  query(select: Field[], values: Measure[]): QueryMerge | Query {
    const targetMeasureSpendingStore = values.filter((m) => spendingMeasures.includes(m))
    const targetMeasurePopulationStore = values.filter((m) => populationMeasures.includes(m))

    let targetFieldSpendingStore = select.filter((f) => spendingFields.includes(f))
    const targetFieldPopulationStore = select.filter((f) => populationFields.includes(f))

    let q1 = undefined
    if (targetMeasureSpendingStore.length > 0) {
      this.aliasTableFields(targetFieldSpendingStore,
              [continent, country],
              [spending.continent, spending.country])

      const gocIndex = targetFieldSpendingStore.indexOf(groupOfCountries)
      targetFieldSpendingStore = targetFieldSpendingStore.filter(f => f !== groupOfCountries)
      const columnSets = gocIndex >= 0 ? [new BucketColumnSet(groupOfCountries, spending.country.as(country.alias), countryGroups)] : []

      q1 = from(spending._name)
              .select(targetFieldSpendingStore, columnSets, targetMeasureSpendingStore)
              .build()
    }

    let q2 = undefined
    if (targetMeasurePopulationStore.length > 0) {
      this.aliasTableFields(targetFieldPopulationStore,
              [continent, country],
              [population.continent, population.country])

      q2 = from(population._name)
              .select(targetFieldPopulationStore, [], targetMeasurePopulationStore)
              .build()
    }

    if (q1 && q2) {
      return new QueryMerge(q2).join(q1, JoinType.LEFT);
    } else if (q1) {
      return q1
    } else if (q2) {
      return q2
    } else {
      throw new Error("No query is defined")
    }
  }

  /**
   * If fields contains an AliasedField, replace it by the TableField with an alias.
   */
  aliasTableFields(fields: Field[], aliasedFields: AliasedField[], fieldToAlias: TableField[]) {
    for (let i = 0; i < aliasedFields.length; i++) {
      const index = fields.indexOf(aliasedFields[i])
      if (index >= 0) {
        fields[index] = fieldToAlias[i].as(aliasedFields[i].alias)
      }
    }
  }
}
