import { SCENARIO_COLUMN } from "../../config";

export type TableData = {
  key: string;
  [SCENARIO_COLUMN]: string;
  groupId: string;
} & {
  [measure: string]: string | boolean;
};

export type InvestigationTableData = TableData & {
  selectedLevel: number;
  children?: InvestigationTableData[];
};

export type TableDataByGroup = {
  [groupId: string]: TableData[];
};
