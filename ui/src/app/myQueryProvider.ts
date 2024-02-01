import {QueryProvider} from "@/app/queries";
import {countRows, from, Measure, Query, sum, TableField} from "@squashql/squashql-js";
import {portfolio} from "@/app/tables";

export class MyQueryProvider implements QueryProvider {

  selectableFields(): TableField[] {
    return portfolio._fields;
  }

  measures(): Measure[] {
    return [countRows, sum("ScenarioValue_SUM", portfolio.scenarioValue)]
  }

  query(select: TableField[], values: Measure[]): Query {
    return from(portfolio._name)
            .select(select, [], values)
            .build()
  }
}
