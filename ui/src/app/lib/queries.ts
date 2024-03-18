import {
  all,
  any,
  comparisonMeasureWithGrandTotalAlongAncestors,
  comparisonMeasureWithParent,
  ComparisonMethod,
  Criteria,
  criterion,
  eq,
  Field,
  integer,
  Measure,
  multiply,
  ParametrizedMeasure,
  PivotConfig,
  Querier,
  TableField
} from "@squashql/squashql-js"

import {QueryProvider} from "@/app/lib/queryProvider"
import {url} from "@/app/lib/constants"
import {portfolio} from "@/app/lib/tables"
import {SelectableElement} from "@/app/components/AxisSelector"

export class QueryExecutor {

  readonly querier = new Querier(url)

  async executePivotQuery(queryProvider: QueryProvider, rows: SelectableElement[], columns: SelectableElement[], values: Measure[], filters: Map<Field, any[]>, minify: boolean) {
    const select = rows.concat(columns)
    if (select.length === 0 || values.length === 0) {
      return Promise.resolve()
    } else {
      const pivotConfig: PivotConfig = {
        rows: rows.map(r => r.type as TableField),
        columns: columns.map(r => r.type as TableField),
        hiddenTotals: select.filter(e => !e.showTotals).map(e => e.type as TableField),
      }

      const measures = values.map(m => {
        if (isMeasureProviderType(m) && m.axis === "row") {
          return m.create(pivotConfig.rows)
        } else if (isMeasureProviderType(m) && m.axis === "column") {
          return m.create(pivotConfig.columns)
        }
        return m
      })

      const query = queryProvider.query(select.map(e => e.type as TableField), measures, filters, pivotConfig)
      query.minify = minify
      return this.querier.executePivotQuery(query, pivotConfig)
    }
  }
}

export interface MeasureProvider {
  create(ancestors: Field[]): Measure

  axis: "row" | "column"
}

export type MeasureProviderType = Measure & MeasureProvider

function isMeasureProviderType(m: Measure): m is MeasureProviderType {
  return "create" in m && "axis" in m
}

export class PercentOfParentAlongAncestors implements MeasureProviderType {
  readonly class: string = "PercentOfParentAlongAncestors"

  constructor(readonly alias: string, readonly underlying: Measure, readonly axis: "row" | "column") {
  }

  create(ancestors: Field[]): Measure {
    const ratio = comparisonMeasureWithParent("_" + this.underlying.alias + "_percent_of_parent_" + this.axis, ComparisonMethod.DIVIDE, this.underlying, ancestors)
    return multiply(this.alias, integer(100), ratio)
  }
}

export class CompareWithGrandTotalAlongAncestors implements MeasureProviderType {
  readonly class: string = "CompareWithGrandTotalAlongAncestors"

  constructor(readonly alias: string, readonly underlying: Measure, readonly axis: "row" | "column") {
  }

  create(ancestors: Field[]): Measure {
    const ratio = comparisonMeasureWithGrandTotalAlongAncestors("percent_of_" + this.axis, ComparisonMethod.DIVIDE, this.underlying, ancestors)
    return multiply(this.alias, integer(100), ratio)
  }
}

export class IncVarAncestors implements MeasureProviderType {
  readonly class: string = ""

  constructor(readonly alias: string, readonly axis: "row" | "column") {
  }

  create(ancestors: Field[]): Measure {
    return new ParametrizedMeasure(this.alias, "INCREMENTAL_VAR", {
      "value": portfolio.scenarioValue,
      "date": portfolio.dateScenario,
      "quantile": 0.95,
      "ancestors": ancestors
    })
  }
}

export function toCriteria(filters: Map<Field, any[]>): Criteria {
  const sqlFilters: Criteria[] = []
  filters.forEach((values, key) => {
    const f = any(values.map(v => criterion(key, eq(v))))
    sqlFilters.push(f)
  })
  return all(sqlFilters)
}

export const queryExecutor: QueryExecutor = new QueryExecutor()
