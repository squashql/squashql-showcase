import {SquashQLTable} from "@/app/lib/tables"
import {TableField, VirtualTable} from "@squashql/squashql-js"

export interface VirtualSquashQLTable extends SquashQLTable {
  getColumnValues(): string[]
}

export const satisfactionLevelsRecords = [
  ["neutral", 0, 2],
  ["happy", 2, 4],
  ["very happy", 4, 5],
]

class SatisfactionLevels implements VirtualSquashQLTable {
  readonly _name = "satisfactionLevels"
  readonly satisfactionLevel: TableField = new TableField("satisfactionLevels.satisfactionLevel")
  readonly lowerBound: TableField = new TableField("satisfactionLevels.lowerBound")
  readonly upperBound: TableField = new TableField("satisfactionLevels.upperBound")
  readonly _fields: TableField[] = [this.satisfactionLevel, this.lowerBound, this.upperBound]

  getColumnValues(): string[] {
    return satisfactionLevelsRecords.map(a => a[0] as string)
  }
}

const expenseLevelsRecords = [
  ["low", 0, 10],
  ["medium", 10, 40],
  ["high", 40, 500],
]

class ExpenseLevels implements VirtualSquashQLTable {
  readonly _name = "expenseLevels"
  readonly expenseLevel: TableField = new TableField("expenseLevels.expenseLevel")
  readonly lowerBound: TableField = new TableField("expenseLevels.lowerBound")
  readonly upperBound: TableField = new TableField("expenseLevels.upperBound")
  readonly _fields: TableField[] = [this.expenseLevel, this.lowerBound, this.upperBound]

  getColumnValues(): string[] {
    return expenseLevelsRecords.map(a => a[0] as string)
  }
}

export const satisfactionLevels = new SatisfactionLevels()
export const expenseLevels = new ExpenseLevels()

export const expenseLevelsVT = new VirtualTable(
        expenseLevels._name,
        [
          expenseLevels.expenseLevel.fieldName,
          expenseLevels.lowerBound.fieldName,
          expenseLevels.upperBound.fieldName
        ], expenseLevelsRecords)
