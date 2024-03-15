import {Field} from "@squashql/squashql-js"
import {CompareWithGrandTotalAlongAncestors, PercentOfParentAlongAncestors} from "@/app/lib/queries"
import {getElementString, SelectableElement} from "@/app/components/AxisSelector"

export interface DashboardState {
  rows: SelectableElement[]
  columns: SelectableElement[]
  values: SelectableElement[]
  filters: SelectableElement[]
  selectableElements: SelectableElement[]
  selectableFilters: SelectableElement[]
  selectableValues: SelectableElement[]
  filtersValues: Map<Field, any[]>
}

export function computeInitialState(key: string, selectableElements: SelectableElement[], selectableFilters: SelectableElement[], selectableValues: SelectableElement[]): DashboardState {
  if (typeof window !== "undefined") {
    const data = window.localStorage.getItem(key)
    if (data) {
      const state: DashboardState = JSON.parse(data, reviver)

      const newFiltersValues = new Map()
      const filters = state.filters.map(getElementString)
      state.filtersValues.forEach((v, k) => {
        const index = filters.indexOf(getElementString(k))
        if (index >= 0) {
          // Replace the deserialized version of the field with the instance from the filters list to be able to use ===
          newFiltersValues.set(state.filters[index].type as Field, v)
        }
      })
      state.filtersValues = newFiltersValues
      console.log(state) // FIXME delete
      return state
    }
  }
  return initialState(selectableElements, selectableFilters, selectableValues)
}

export function saveCurrentState(key: string, state: DashboardState) {
  window.localStorage.setItem(key, JSON.stringify(state, replacer))
}

function initialState(selectableElements: SelectableElement[], selectableFilters: SelectableElement[], selectableValues: SelectableElement[]): DashboardState {
  return {
    columns: [],
    filters: [],
    filtersValues: new Map(),
    rows: [],
    selectableElements,
    selectableFilters,
    selectableValues,
    values: []
  }
}

function serializeMap(map: Map<any, any>): Map<string, any> {
  const m = new Map()
  for (const [key, value] of map) {
    m.set(JSON.stringify(key), value)
  }
  return m
}

function reviver(key: string, value: any) {
  if (key === "filtersValues") {
    const m: Map<Field, any> = new Map
    Object.entries(value).forEach(([k, v]) => m.set(JSON.parse(k), v))
    return m
  } else if (key === "type" && typeof value === "object") {
    if (value["class"] === "PercentOfParentAlongAncestors") {
      return new PercentOfParentAlongAncestors(value["alias"], value["underlying"], value["axis"])
    } else if (value["class"] === "CompareWithGrandTotalAlongAncestors") {
      return new CompareWithGrandTotalAlongAncestors(value["alias"], value["underlying"], value["axis"])
    }
  }

  return value
}

function replacer(key: string, value: any) {
  if (key === "filtersValues") {
    return Object.fromEntries(serializeMap(value))
  } else {
    return value
  }
}
