import {
  AggregatedMeasure,
  all,
  any, BinaryOperationMeasure,
  comparisonMeasureWithGrandTotalAlongAncestors,
  comparisonMeasureWithParent,
  ComparisonMethod, computePeriodDependencies,
  Criteria,
  criterion,
  eq, ExpressionMeasure,
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
import {
  ComparisonMeasureGrandTotal,
  ComparisonMeasureReferencePosition,
  DoubleConstantMeasure,
  LongConstantMeasure
} from "@squashql/squashql-js/dist/measure"

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

      const measures = values.map(m => createMeasure(m, pivotConfig))
      const query = queryProvider.query(select.map(e => e.type as TableField), measures, filters, pivotConfig)
      query.minify = minify
      return this.querier.executePivotQuery(query, pivotConfig)
    }
  }
}

export interface MeasureProvider {
  create(pivotConfig: PivotConfig): Measure

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

  create(pivotConfig: PivotConfig): Measure {
    const underlying = createMeasure(this.underlying, pivotConfig)
    const ratio = comparisonMeasureWithParent(`percent_of_parent_${this.axis}_${this.underlying.alias}`, ComparisonMethod.DIVIDE, underlying, getAncestors(this, pivotConfig))
    return multiply(this.alias, integer(100), ratio)
  }
}

export class CompareWithGrandTotalAlongAncestors implements MeasureProviderType {
  readonly class: string = "CompareWithGrandTotalAlongAncestors"

  constructor(readonly alias: string, readonly underlying: Measure, readonly axis: "row" | "column") {
  }

  create(pivotConfig: PivotConfig): Measure {
    const underlying = createMeasure(this.underlying, pivotConfig)
    const ratio = comparisonMeasureWithGrandTotalAlongAncestors(`percent_of_${this.axis}_${this.underlying.alias}`, ComparisonMethod.DIVIDE, underlying, getAncestors(this, pivotConfig))
    return multiply(this.alias, integer(100), ratio)
  }
}

export class IncVarAncestors implements MeasureProviderType {
  readonly class: string = ""

  constructor(readonly alias: string, readonly axis: "row" | "column") {
  }

  create(pivotConfig: PivotConfig): Measure {
    return new ParametrizedMeasure(this.alias, "INCREMENTAL_VAR", {
      "value": portfolio.scenarioValue,
      "date": portfolio.dateScenario,
      "quantile": 0.95,
      "ancestors": getAncestors(this, pivotConfig)
    })
  }
}

function getAncestors(m: MeasureProviderType, pivotConfig: PivotConfig) {
  switch (m.axis) {
    case "column":
      return pivotConfig.columns
    case "row":
      return pivotConfig.rows
    default:
      throw new Error(`Unexpected axis type ${m.axis}`)
  }
}

function createMeasure(measure: Measure, pivotConfig: PivotConfig): Measure {
  if (isMeasureProviderType(measure)) {
    return measure.create(pivotConfig)
  }

  switch (measure.constructor) {
    case BinaryOperationMeasure:
      const bom = (measure as BinaryOperationMeasure)
      const lop = createMeasure(bom.leftOperand, pivotConfig)
      const rop = createMeasure(bom.rightOperand, pivotConfig)
      return new BinaryOperationMeasure(bom.alias, bom.operator, lop, rop)
    case ComparisonMeasureGrandTotal:
      const cmgt = (measure as ComparisonMeasureGrandTotal)
      return new ComparisonMeasureGrandTotal(
              cmgt.alias,
              cmgt.comparisonMethod,
              createMeasure(cmgt.measure, pivotConfig))
    case ComparisonMeasureReferencePosition:
      const cmrp = (measure as ComparisonMeasureReferencePosition)
      return new ComparisonMeasureReferencePosition(
              cmrp.alias,
              cmrp.comparisonMethod,
              createMeasure(cmrp.measure, pivotConfig),
              cmrp.referencePosition,
              cmrp.columnSetKey,
              cmrp.period,
              cmrp.ancestors,
              cmrp.grandTotalAlongAncestors)
    default:
      return measure
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
