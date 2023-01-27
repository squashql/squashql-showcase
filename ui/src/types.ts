import { TreeGraphData } from "@antv/g6-core/es/types";
import { CardItems } from "@ant-design/graphs";
import { Measure, Table } from "@squashql/squashql-js";

export interface IconInterface {
  iconColor?: string;
  iconShape?: string;
}

export interface TreeGraphMeasureInfo extends CardItems, IconInterface {
  comparedMeasure?: TreeGraphMeasureInfo;
  expression?: string;
  isDifference?: boolean;
  legendColor?: string;
  comparisonMethod?: string;
  text: string;
}

export interface ScenarioTreeGraphData extends TreeGraphData {
  scenarioName: string;
  value: {
    groupId?: string;
    title: string;
    items: TreeGraphMeasureInfo[];
  };
  children?: ScenarioTreeGraphData[];
}

type Period =
  | {
      "@class": string;
      [periodName: string]: string;
    }
  | {
      "@class": string;
      period: Period;
    };

export type Group = string[];

export type Groups = Record<string, Group>;

export interface GroupsParamsInterface {
  "@class": string;
  name: string;
  field: string;
  values: Groups;
}

export interface FieldData {
  name: string | number | (string | number)[];
  value?: string | number | boolean;
}

export interface ColumnSets {
  columnSets: {
    bucket: GroupsParamsInterface;
    period: Period;
  };
}

export type NumberFormat = "none" | "currency" | "percent";

// TODO: Clean.
export interface FormattingData {
  chartRounding: number;
  format: NumberFormat;
  tableRounding: number;
}

export interface ComparisonParamsInterface {
  measures: Measure[];
}

export type ScenarioGroupingQueryParamsInterface = ColumnSets &
  ComparisonParamsInterface &
  Table;

export interface PeriodField {
  field?: string;
  value?: string;
}
