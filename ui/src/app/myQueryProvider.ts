import {countRows, from, Measure, Query, sum, TableField} from "@squashql/squashql-js";
import {portfolio} from "@/app/tables";

export class QueryProvider {

  /**
   * the list of fields that can be used on row or column axis
   */
  selectableFields(): TableField[] {
    return portfolio._fields;
  }

  /**
   * the list of measures that can be selected
   */
  measures(): Measure[] {
    return [countRows, sum("ScenarioValue_SUM", portfolio.scenarioValue)]
  }

  query(select: TableField[], values: Measure[]): Query {
    return from(portfolio._name)
            .select(select, [], values)
            .build()
  }
}
