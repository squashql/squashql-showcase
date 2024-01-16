import {Field, Measure} from "@squashql/squashql-js";

export class FieldAndAggFunc {
  // readonly field: Field;
  // readonly aggFunc: string;

  constructor(readonly field: Field, readonly aggFunc: string) {
    // this.field = field;
    // this.aggFunc = aggFunc;
  }
}

export class VectorTupleAggMeasure implements Measure {
  readonly alias: string
  readonly class: string = "io.squashql.query.VectorTupleAggMeasure"
  readonly fieldToAggregateAndAggFunc: FieldAndAggFunc[]
  readonly vectorAxis: Field

  constructor(alias: string, fieldToAggregateAndAggFunc: FieldAndAggFunc[], vectorAxis: Field) {
    this.alias = alias
    this.fieldToAggregateAndAggFunc = fieldToAggregateAndAggFunc
    this.vectorAxis = vectorAxis
  }

  toJSON() {
    return {
      "@class": this.class,
      "alias": this.alias,
      "fieldToAggregateAndAggFunc": this.fieldToAggregateAndAggFunc,
      "vectorAxis": this.vectorAxis,
    }
  }
}
