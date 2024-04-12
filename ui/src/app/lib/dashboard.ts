import {Field, Measure, squashQLReviver} from "@squashql/squashql-js"
import {getElementString, SelectableElement} from "@/app/components/AxisSelector"
import {useCallback, useEffect, useState} from "react"
import {Formatter, formatters} from "@/app/lib/formatters"

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

export class PivotTableCellFormatter {

  constructor(readonly field: string,
              readonly formatter: Formatter) {
  }

  toJSON() {
    return {
      "@class": "PivotTableCellFormatter",
      "field": this.field,
      "label": this.formatter.label
    }
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
  formatters: PivotTableCellFormatter[]
}

export function computeInitialState(key: string,
                                    selectableElements: SelectableElement[],
                                    selectableFilters: SelectableElement[],
                                    selectableValues: SelectableElement[],
                                    formatters: PivotTableCellFormatter[]): DashboardState {
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
  return initialState(selectableElements, selectableFilters, selectableValues, formatters)
}

export function saveCurrentState(key: string, state: DashboardState) {
  window.localStorage.setItem(key, serialize(state))
}

function initialState(selectableElements: SelectableElement[],
                      selectableFilters: SelectableElement[],
                      selectableValues: SelectableElement[],
                      formatters: PivotTableCellFormatter[]): DashboardState {
  return {
    columns: [],
    filters: [],
    filtersValues: new Map(),
    rows: [],
    selectableElements,
    selectableFilters,
    selectableValues,
    values: [],
    formatters
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
    Object.entries(value).forEach(([k, v]) => m.set(squashQLReviver(k, JSON.parse(k)), v))
    return m
  } else if (typeof value === "object" && value["@class"] === "PivotTableCellFormatter") {
    const label = value["label"]
    const f = formatters.find(f => f.label === label)
    return f ? new PivotTableCellFormatter(value["field"], f) : undefined
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

export function serialize(state: DashboardState): string {
  return JSON.stringify(state, replacer)
}

export function serialize_(value: any): string {
  return JSON.stringify(value, replacer)
}

export function deserialize_(value: string): any {
  return deserialize(value)
}

export function deserialize(value: string): DashboardState {
  return JSON.parse(value, (k, v) => squashQLReviver(k, v, reviver))
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
    redo,
    canUndo: history.currentIndex > 0,
    canRedo: history.currentIndex < history.states.length - 1,
  }
}
