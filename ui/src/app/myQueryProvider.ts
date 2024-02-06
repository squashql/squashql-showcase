import {countRows, from, JoinType, Measure, Query, QueryMerge, sum, TableField} from "@squashql/squashql-js";
import {population, spending} from "@/app/tables";

export class QueryProvider {

  /**
   * the list of fields that can be used on row or column axis
   */
  selectableFields(): TableField[] {
    return [];
  }

  /**
   * the list of measures that can be selected
   */
  measures(): Measure[] {
    return [countRows]
  }

  query(select: TableField[], values: Measure[]): Query {
    return from("portfolio._name")
            .select(select, [], values)
            .build()
  }

  queryMerge(): QueryMerge {
    const q1 = from(spending._name)
            .select([spending.spendingCategory, spending.continent.as("continent"), spending.country.as("country")], [], [sum("amount", spending.amount)])
            .build();
    const q2 = from(population._name)
            .select([population.continent.as("continent"), population.country.as("country")], [], [sum("population", population.population)])
            .build();
    return new QueryMerge(q2).join(q1, JoinType.LEFT)
  }
}
