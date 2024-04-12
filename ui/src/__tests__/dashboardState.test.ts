import {describe, expect, test} from '@jest/globals'
import {
  DashboardState,
  deserialize,
  deserialize_,
  fieldToSelectableElement,
  measureToSelectableElement,
  PivotTableCellFormatter,
  serialize,
  serialize_
} from "@/app/lib/dashboard"
import {
  AliasedField,
  any,
  Axis,
  BinaryOperationMeasure,
  BinaryOperator,
  comparisonMeasureWithGrandTotal,
  comparisonMeasureWithGrandTotalAlongAncestors,
  comparisonMeasureWithParent,
  comparisonMeasureWithPeriod,
  ComparisonMethod,
  criterion,
  eq,
  ExpressionMeasure,
  Field,
  Month,
  ParametrizedMeasure,
  PartialHierarchicalComparisonMeasure,
  sum,
  sumIf,
  TableField,
} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"
import {eurFormatter, var95fDateOnly} from "@/app/lib/formatters"

// Fields
const a = new TableField("table.a")
const b = new TableField("table.b")
const c = new AliasedField("c")
const year = new TableField("table.year")
const month = new TableField("table.month")
const date = new TableField("table.date")
const city = new TableField("table.city")

// Measures
const sumA = sum("sum_a", a)
const sumIfA = sumIf("sumIfA", a.divide(b.plus(c)), criterion(b, eq("bbb")))
const expr = new ExpressionMeasure("expr", "my sql")
const bom = new BinaryOperationMeasure("binary measure", BinaryOperator.PLUS, sumA, expr)
const growth = comparisonMeasureWithPeriod("growth", ComparisonMethod.DIVIDE, sumA, new Map([
  [year, "y-1"],
  [month, "m"]
]), new Month(month, year))
const parent = comparisonMeasureWithParent("parent", ComparisonMethod.DIVIDE, sumA, [year, month])
const grandTotalAlongAncestors = comparisonMeasureWithGrandTotalAlongAncestors("grandTotalAlongAncestors", ComparisonMethod.DIVIDE, sumA, [year, month])
const grandTotal = comparisonMeasureWithGrandTotal("grandTotal", ComparisonMethod.DIVIDE, sumA)
const var95 = new ParametrizedMeasure("var measure", "VAR", {
  "value": a,
  "date": date,
  "quantile": 0.95
})
const incrVar95 = new ParametrizedMeasure("incr var measure", "INCREMENTAL_VAR", {
  "value": a,
  "date": date,
  "quantile": 0.95,
  "ancestors": [a, b, c],
})
const percentOfParentAlongAncestors = new PartialHierarchicalComparisonMeasure("pop along ancestors", ComparisonMethod.DIVIDE, sumA, Axis.ROW, false)
const compareWithGrandTotalAlongAncestors = new PartialHierarchicalComparisonMeasure("gt along ancestors", ComparisonMethod.DIVIDE, sumA, Axis.ROW, false)

const filtersValues = new Map
filtersValues.set(fieldToSelectableElement(city), ["la", "paris"])
filtersValues.set(fieldToSelectableElement(a), [1, 2])
filtersValues.set(fieldToSelectableElement(b), [true])

const formatters = [
  new PivotTableCellFormatter(getElementString(a), eurFormatter),
  new PivotTableCellFormatter(getElementString(b), var95fDateOnly)
]

const state: DashboardState = {
  rows: [],
  columns: [],
  values: [sumA, sumIfA, expr, bom].map(measureToSelectableElement),
  selectableElements: [a, b, c, city].map(fieldToSelectableElement),
  selectableValues: [growth, parent, grandTotalAlongAncestors, grandTotal, var95, incrVar95, percentOfParentAlongAncestors, compareWithGrandTotalAlongAncestors].map(measureToSelectableElement),
  selectableFilters: [a, b, c, city].map(fieldToSelectableElement),
  filters: [city, a, b].map(fieldToSelectableElement),
  filtersValues,
  formatters
}

describe('serialization', () => {

  test('serialize dashboard state', () => {
    const json = serialize(state)
    const obj = deserialize(json)
    expect(state.rows).toEqual(obj.rows)
    expect(state.columns).toEqual(obj.columns)
    expect(state.values).toEqual(obj.values)
    expect(state.selectableElements).toEqual(obj.selectableElements)
    expect(state.selectableValues).toEqual(obj.selectableValues)
    expect(state.selectableFilters).toEqual(obj.selectableFilters)
    expect(state.filters).toEqual(obj.filters)
    expect(state.filtersValues.size).toEqual(obj.filtersValues.size)
    expect(state.formatters).toEqual(obj.formatters)
    expect(compareMaps(state.filtersValues, obj.filtersValues)).toBeTruthy()
  })

})

function compareMaps(map1: Map<Field, any>, map2: Map<Field, any>) {
  if (map1.size !== map2.size) {
    return false
  }
  for (let [key, val] of map1) {
    for (let [key2, val2] of map2) {
      if (getElementString(key) === getElementString(key2)) {
        return arraysEqual(val, val2)
      }
    }
    return false
  }
}

function arraysEqual(a: any[], b: any[]) {
  if (a === b) {
    return true
  }
  if (a == null || b == null) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }

  const cloneA = a.slice().sort()
  const cloneB = a.slice().sort()
  for (let i = 0; i < a.length; ++i) {
    if (cloneA[i] !== cloneB[i]) {
      return false
    }
  }
  return true
}
