import {
  comparisonMeasureWithParent,
  ComparisonMethod,
  Field, integer,
  Measure, multiply, ParametrizedMeasure,
  PivotConfig,
  Querier,
  TableField
} from "@squashql/squashql-js"

import {MeasureProviderType, QueryProvider} from "@/app/lib/queryProvider"
import {url} from "@/app/lib/constants"
import {portfolio} from "@/app/lib/tables"

export class QueryExecutor {

  readonly querier = new Querier(url)

  async executePivotQuery(queryProvider: QueryProvider, rows: TableField[], columns: TableField[], values: Measure[], minify: boolean) {
    const select = rows.concat(columns)
    if (select.length === 0 || values.length === 0) {
      return undefined
    } else {
      const pivotConfig: PivotConfig = {
        rows,
        columns,
      }
      const query = queryProvider.query(select, values, pivotConfig);
      query.minify = minify
      return this.querier.executePivotQuery(query, pivotConfig)
    }
  }
}

export class PercentOfParentAlongAncestors implements MeasureProviderType {
  readonly class: string = ""

  constructor(readonly alias: string, readonly underlying: Measure, readonly axis: "row" | "column") {
  }

  create(ancestors: Field[]): Measure {
    const ratio = comparisonMeasureWithParent("_" + this.underlying.alias + "_percent_of_parent_" + this.axis, ComparisonMethod.DIVIDE, this.underlying, ancestors)
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

export const queryExecutor: QueryExecutor = new QueryExecutor()
