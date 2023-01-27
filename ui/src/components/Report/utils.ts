import _groupBy from "lodash/groupBy";
import _compact from "lodash/compact";

import { getIndex } from "../utils";
import { TableDataByGroup } from "./types";
import { FetchedData } from "../../network/types";
import { GROUP_COLUMN, SCENARIO_COLUMN } from "../../config";
import { formatTableNumber } from "../../dataFormatting";
import { FormattingData } from "../../types";
import { ColumnType } from "antd/lib/table";

export const getTableDataByGroup = (
  data: FetchedData,
  measuresSettings: Record<string, FormattingData>
): TableDataByGroup => {
  const {
    table: { columns, rows },
  } = data;
  const scenarioColumnIndex = getIndex(columns, SCENARIO_COLUMN);
  const groupColumnIndex = getIndex(columns, GROUP_COLUMN);

  const scenarii = rows.map((scenario, rowIndex) => ({
    key: String(rowIndex),
    [SCENARIO_COLUMN]: scenario[scenarioColumnIndex] as string,
    groupId: scenario[groupColumnIndex] as string,
    id: `${scenario[groupColumnIndex]}--${scenario[scenarioColumnIndex]}`,
    ...scenario.reduce(
      (accumulator, cell, index) =>
        index !== scenarioColumnIndex && index !== groupColumnIndex
          ? {
              ...accumulator,
              [columns[index]]:
                typeof cell === "number"
                  ? formatTableNumber(
                      cell,
                      measuresSettings[data.table.columns[index]]
                    )
                  : cell,
            }
          : accumulator,
      {}
    ),
  }));

  const tableDataByGroup = _groupBy(scenarii, "groupId");

  return tableDataByGroup;
};

const getType = (column: string, metadata: FetchedData["metadata"]) =>
  metadata.find((metadatum) => metadatum.name === column)?.type;

export const getAlignment = (
  column: string,
  metadata: FetchedData["metadata"]
): "left" | "right" => {
  const columnType = getType(column, metadata);

  return columnType === "java.lang.String" || columnType === "boolean"
    ? "left"
    : "right";
};

export const getTableColumns = (
  columns: FetchedData["table"]["columns"],
  metadata: FetchedData["metadata"]
): ColumnType<Record<string, unknown>>[] =>
  _compact(
    columns.map((col) =>
      col === GROUP_COLUMN
        ? undefined
        : {
            title: col,
            dataIndex: col,
            key: col,
            align: getAlignment(col, metadata),
            render: (text: string | number | boolean | null) => String(text),
          }
    )
  );
