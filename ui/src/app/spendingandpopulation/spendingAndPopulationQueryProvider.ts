import {
  AliasedField,
  Field,
  from,
  JoinType,
  Measure,
  PivotConfig,
  Query,
  QueryMerge,
  sum,
  TableField
} from "@squashql/squashql-js"
import {population, spending} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"
import {toCriteria} from "@/app/lib/queries"

const continent = new AliasedField("continent")
const country = new AliasedField("country")

function createPopulationMeasures(): Measure[] {
  const pop = sum("population", population.population)
  return [pop]
}

function createSpendingMeasures(): Measure[] {
  const amount = sum("amount", spending.amount)
  return [amount]
}

function createSpendingFields(): Field[] {
  return [spending.spendingCategory, spending.spendingSubcategory, spending.city, spending.year, continent, country]
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
  readonly table = [spending, population]

  query(select: Field[], values: Measure[], filters: Map<Field, any[]>, pivotConfig: PivotConfig): QueryMerge | Query {
    const targetMeasureSpendingStore = values.filter((m) => spendingMeasures.includes(m))
    const targetMeasurePopulationStore = values.filter((m) => populationMeasures.includes(m))

    let targetFieldSpendingStore = select.filter((f) => spendingFields.includes(f))
    const targetFieldPopulationStore = select.filter((f) => populationFields.includes(f))

    let q1 = undefined
    if (targetMeasureSpendingStore.length > 0) {
      this.aliasTableFields(targetFieldSpendingStore,
              [continent, country],
              [spending.continent, spending.country])

      const copy = this.aliasTableFieldsInFilters(filters,
              [continent, country],
              [spending.continent, spending.country])

      q1 = from(spending._name)
              .where(toCriteria(copy))
              .select(targetFieldSpendingStore, [], targetMeasureSpendingStore)
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
      return new QueryMerge(q2).join(q1, JoinType.LEFT)
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

  aliasTableFieldsInFilters(filters: Map<Field, any[]>, aliasedFields: AliasedField[], fieldToAlias: TableField[]) {
    const copy = new Map(filters)
    for (let i = 0; i < aliasedFields.length; i++) {
      const v = filters.get(aliasedFields[i])
      if (v) {
        copy.delete(aliasedFields[i])
        copy.set(fieldToAlias[i].as(aliasedFields[i].alias), v)
      }
    }
    return copy
  }
}
