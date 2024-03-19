import {describe, expect, test} from '@jest/globals'
import {
  DashboardState,
  deserialize,
  fieldToSelectableElement,
  measureToSelectableElement,
  serialize
} from "@/app/lib/dashboard"
import {TableField, sum, AliasedField, Field} from "@squashql/squashql-js"
import {getElementString} from "@/app/components/AxisSelector"

const a = fieldToSelectableElement(new TableField("table.a"))
const b = fieldToSelectableElement(new TableField("table.b"))
const c = fieldToSelectableElement(new AliasedField("c"))
const city = fieldToSelectableElement(new TableField("table.city"))
const sumA = measureToSelectableElement(sum("sum_a", new TableField("table.a")))

const filtersValues = new Map
filtersValues.set(new TableField("table.city"), ["la", "paris"])
filtersValues.set(new TableField("table.a"), [1, 2])

const state: DashboardState = {
  rows: [],
  columns: [],
  values: [],
  selectableElements: [a, b, c, city],
  selectableValues: [sumA],
  selectableFilters: [a, b, c, city],
  filters: [city, a],
  filtersValues,
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
