import {AliasedField, Field, from, JoinType, Measure, Query, QueryMerge, sum, TableField} from "@squashql/squashql-js"
import {population, spending} from "@/app/lib/tables"
import {QueryProvider} from "@/app/lib/queryProvider"

const continent = new AliasedField("continent")
const country = new AliasedField("country")

export class SpendingAndPopulationQueryProvider implements QueryProvider {

  readonly selectableFields = [spending.spendingCategory, spending.spendingSubcategory, spending.city, continent, country]
  readonly measures = [sum("amount", spending.amount), sum("population", population.population)]

  query(select: Field[], values: Measure[]): QueryMerge | Query {
    const targetMeasurePopulationStore = values.filter((m) => m.alias === "population")
    const targetMeasureSpendingStore = values.filter((m) => m.alias === "amount")

    const spendingFields: Field[] = [spending.spendingCategory, spending.spendingSubcategory, spending.city, continent, country]
    const populationFields: Field[] = [continent, country]
    const targetFieldSpendingStore = select.filter((f) => spendingFields.includes(f))
    const targetFieldPopulationStore = select.filter((f) => populationFields.includes(f))

    let q1 = undefined
    if (targetMeasureSpendingStore.length > 0) {
      this.aliasTableField(targetFieldSpendingStore, continent, spending.continent)
      this.aliasTableField(targetFieldSpendingStore, country, spending.country)

      q1 = from(spending._name)
              .select(targetFieldSpendingStore, [], targetMeasureSpendingStore)
              .build()
    }

    let q2 = undefined
    if (targetMeasurePopulationStore.length > 0) {
      this.aliasTableField(targetFieldPopulationStore, continent, population.continent)
      this.aliasTableField(targetFieldPopulationStore, country, population.country)

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

  aliasTableField(fields: Field[], aliasedField: AliasedField, fieldToAlias: TableField) {
    const index = fields.indexOf(aliasedField)
    if (index >= 0) {
      fields[index] = fieldToAlias.as(aliasedField.alias)
    }
  }
}
