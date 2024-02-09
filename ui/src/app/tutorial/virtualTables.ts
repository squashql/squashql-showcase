import {SquashQLTable} from "@/app/lib/tables";
import {TableField, VirtualTable} from "@squashql/squashql-js";

class SatisfactionLevels implements SquashQLTable {
  readonly _name = "satisfactionLevels"
  readonly satisfactionLevel: TableField = new TableField("satisfactionLevels.satisfactionLevel")
  readonly lowerBound: TableField = new TableField("satisfactionLevels.lowerBound")
  readonly upperBound: TableField = new TableField("satisfactionLevels.upperBound")
  readonly _fields: TableField[] = [this.satisfactionLevel, this.lowerBound, this.upperBound]
}

class ExpenseLevels implements SquashQLTable {
  readonly _name = "expenseLevels"
  readonly expenseLevel: TableField = new TableField("expenseLevels.expenseLevel")
  readonly lowerBound: TableField = new TableField("expenseLevels.lowerBound")
  readonly upperBound: TableField = new TableField("expenseLevels.upperBound")
  readonly _fields: TableField[] = [this.expenseLevel, this.lowerBound, this.upperBound]
}

const satisfactionLevels = new SatisfactionLevels()
const expenseLevels = new ExpenseLevels()

const records = [
  ["neutral", 0, 2],
  ["happy", 2, 4],
  ["very happy", 4, 5],
]

const satisfactionLevelsVT = new VirtualTable(
        satisfactionLevels._name,
        [
          satisfactionLevels.satisfactionLevel.fieldName,
          satisfactionLevels.lowerBound.fieldName,
          satisfactionLevels.upperBound.fieldName
        ], records)

const expenseLevelsRecords = [
  ["low", 0, 10],
  ["medium", 10, 40],
  ["high", 40, 500],
]

const expenseLevelsVT = new VirtualTable(
        expenseLevels._name,
        [
          expenseLevels.expenseLevel.fieldName,
          expenseLevels.lowerBound.fieldName,
          expenseLevels.upperBound.fieldName
        ], expenseLevelsRecords)

export {
  satisfactionLevels, satisfactionLevelsVT, expenseLevels, expenseLevelsVT
}
