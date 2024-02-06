/*
 * This file has been generated by squashql-codegen. The project is available here https://github.com/squashql/squashql-codegen
 */
import {TableField} from "@squashql/squashql-js"

export interface SquashQLTable {
    _fields: TableField[]
    _name: string
}

class Spending implements SquashQLTable {
    readonly _name = "spending"
    readonly city: TableField = new TableField("spending.city")
    readonly country: TableField = new TableField("spending.country")
    readonly continent: TableField = new TableField("spending.continent")
    readonly spendingCategory: TableField = new TableField("spending.spending category")
    readonly spendingSubcategory: TableField = new TableField("spending.spending subcategory")
    readonly amount: TableField = new TableField("spending.amount")
    readonly scenario: TableField = new TableField("spending.scenario")
    readonly _fields: TableField[] = [this.city, this.country, this.continent, this.spendingCategory, this.spendingSubcategory, this.amount, this.scenario]
}

class Population implements SquashQLTable {
    readonly _name = "population"
    readonly country: TableField = new TableField("population.country")
    readonly continent: TableField = new TableField("population.continent")
    readonly population: TableField = new TableField("population.population")
    readonly scenario: TableField = new TableField("population.scenario")
    readonly _fields: TableField[] = [this.country, this.continent, this.population, this.scenario]
}

const spending = new Spending()
const population = new Population()

export {
    spending, population
}
