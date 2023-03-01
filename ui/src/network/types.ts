import { MetadataItem, MetadataResult, Measure } from "@squashql/squashql-js";

interface Store {
  fields: { type: "string" | "int" | "double"; name: string }[];
  name: string;
}
export interface Metric {
  alias: string;
  expression: string;
}

export interface DiscoveryData {
  aggregationFunctions: string[];
  measures: Metric[];
  stores: Store[];
}

export interface NumberFields extends MetadataItem {
  type: "int" | "double";
}

export interface FilterStoreAndValues {
  store: string;
  values: string[];
}

export interface FormattedMetaData {
  aggregations: string[];
  filters: FilterStoreAndValues[];
  fields: MetadataItem[];
  measures: Measure[];
  numbers: NumberFields[];
  periods: NumberFields[];
  stores: MetadataResult["stores"];
}

export type Row = (string | number | null)[];

export interface FetchedMetaDatum {
  type: string;
  name: string;
  expression?: string;
}

export interface FetchedData {
  metadata: FetchedMetaDatum[];
  table: {
    columns: string[];
    rows: Row[];
  };
}
