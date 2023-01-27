import { Measure } from "@squashql/squashql-js";

type TableName = string;

export type MeasuresDescription = {
  from: TableName;
  measures: Measure[];
  comparisonMeasures: Measure[];
};
