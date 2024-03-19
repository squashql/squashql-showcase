import {
  AggregatedMeasure, AliasedField,
  BinaryOperationMeasure, Criteria,
  ExpressionMeasure,
  Field, Measure,
  ParametrizedMeasure, TableField
} from "@squashql/squashql-js"
import {CompareWithGrandTotalAlongAncestors, PercentOfParentAlongAncestors} from "@/app/lib/queries"
import {getElementString, SelectableElement} from "@/app/components/AxisSelector"
import {useCallback, useEffect, useState} from "react"
import {ComparisonMeasureGrandTotal, ComparisonMeasureReferencePosition} from "@squashql/squashql-js/dist/measure"
import {SingleValueCondition} from "@squashql/squashql-js/dist/conditions"; // FIXME

export function fieldToSelectableElement(f: Field) {
  return {
    type: f,
    showTotals: true
  }
}

export function measureToSelectableElement(m: Measure) {
  return {
    type: m,
    showTotals: true
  }
}

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
      const state: DashboardState = deserialize(data)

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
      return state
    }
  }
  return initialState(selectableElements, selectableFilters, selectableValues)
}

export function saveCurrentState(key: string, state: DashboardState) {
  window.localStorage.setItem(key, serialize(state))
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
    values: [],
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
    Object.entries(value).forEach(([k, v]) => m.set(transformToObject(JSON.parse(k)), v))
    return m
  } else if (typeof value === "object") {
    return transformToObject(value)
  }
  return value
}

function transformToObject(value: any): any {
  if (value["class"] === "PercentOfParentAlongAncestors") {
    return new PercentOfParentAlongAncestors(value["alias"], value["underlying"], value["axis"])
  } else if (value["class"] === "CompareWithGrandTotalAlongAncestors") {
    return new CompareWithGrandTotalAlongAncestors(value["alias"], value["underlying"], value["axis"])
  } else if (value["@class"] === "io.squashql.query.AggregatedMeasure") {
    return new AggregatedMeasure(value["alias"], transformToObject(value["field"]), value["aggregationFunction"], value["distinct"], value["criteria"])
  } else if (value["@class"] === "io.squashql.query.ExpressionMeasure") {
    return new ExpressionMeasure(value["alias"], value["expression"])
  } else if (value["@class"] === "io.squashql.query.BinaryOperationMeasure") {
    return new BinaryOperationMeasure(
            value["alias"],
            value["operator"],
            transformToObject(value["leftOperand"]),
            transformToObject(value["rightOperand"]))
  } else if (value["@class"] === "io.squashql.query.ComparisonMeasureGrandTotal") {
    return new ComparisonMeasureGrandTotal(
            value["alias"],
            value["comparisonMethod"],
            transformToObject(value["measure"]))
  } else if (value["@class"] === "io.squashql.query.ComparisonMeasureReferencePosition") {
    const m: Map<Field, any> = new Map
    value["referencePosition"] && Object.entries(value["referencePosition"])?.forEach(([k, v]) => m.set(transformToObject(k), v))
    return new ComparisonMeasureReferencePosition(
            value["alias"],
            value["comparisonMethod"],
            transformToObject(value["measure"]),
            m,
            value["columnSetKey"],
            value["period"],
            value["ancestors"]?.map((v: any) => transformToObject(v)),
            value["grandTotalAlongAncestors"])
  } else if (value["@class"] === "io.squashql.query.measure.ParametrizedMeasure") {
    return new ParametrizedMeasure(
            value["alias"],
            value["key"],
            value["parameters"])
  } else if (value["@class"] === "io.squashql.query.TableField") {
    return new TableField(
            value["fullName"],
            value["alias"])
  } else if (value["@class"] === "io.squashql.query.AliasedField") {
    return new AliasedField(value["alias"])
  } else if (value["@class"] === "io.squashql.query.dto.SingleValueConditionDto") {
    return new SingleValueCondition(value["type"], value["value"])
  } else {
    return value
  }
}

function replacer(key: string, value: any) {
  if (key === "filtersValues") {
    return Object.fromEntries(serializeMap(value))
  } else {
    return value
  }
}

export function serialize(state: DashboardState): string {
  return JSON.stringify(state, replacer)
}

export function serialize_(value: any): string {
  return JSON.stringify(value, replacer)
}

export function deserialize(state: string): DashboardState {
  return JSON.parse(state, reviver)
}

interface History {
  states: DashboardState[]
  currentIndex: number
}

export function useUndoRedo(initialValue: DashboardState, limit = 8) {
  const [history, setHistory] = useState<History>({
    states: [initialValue],
    currentIndex: 0
  })

  function set(dispatch: (prevState: DashboardState) => DashboardState) {
    setHistory((prevHistory) => {
      const nextState = dispatch({...prevHistory.states[prevHistory.currentIndex]}) // do a copy
      let nextHistory = prevHistory.states.slice(0, prevHistory.currentIndex + 1)
      nextHistory.push(nextState)
      if (nextHistory.length > limit) {
        nextHistory = nextHistory.slice(nextHistory.length - limit)
      }
      return {
        states: nextHistory,
        currentIndex: nextHistory.length - 1
      }
    })
  }

  const undo = useCallback(() => {
    setHistory({
      ...history,
      currentIndex: Math.max(history.currentIndex - 1, 0)
    })
  }, [history])

  const redo = useCallback(() => {
    setHistory({
      ...history,
      currentIndex: Math.min(history.currentIndex + 1, history.states.length - 1)
    })
  }, [history])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z") {
        redo()
      } else if ((event.ctrlKey || event.metaKey) && event.key === "y") {
        redo()
      } else if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [redo, undo])

  return {
    state: history.states[history.currentIndex],
    setState: set,
    undo,
    redo
  }
}
