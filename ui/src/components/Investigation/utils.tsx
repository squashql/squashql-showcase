import React, { Dispatch, FC, SetStateAction } from "react";
import { ColumnType } from "antd/lib/table";
import _compact from "lodash/compact";
import _groupBy from "lodash/groupBy";
import _isEmpty from "lodash/isEmpty";

import { GROUP_COLUMN, SCENARII_TABLE, SCENARIO_COLUMN } from "../../config";
import { SelectedFiltersType } from "../../contexts/FiltersContext";
import { FetchedData } from "../../network/types";
import { FormattingData } from "../../types";
import { InvestigationTableData, TableData } from "../Report/types";
import { getAlignment, getTableDataByGroup } from "../Report/utils";
import ExpandColumnHeader from "./ExpandColumnHeader";
import { ExpandColumn } from "./types";

export const getInvestigationTableColumns = (
  data: FetchedData,
  expandColumns: ExpandColumn[],
  setExpandColumns: Dispatch<SetStateAction<ExpandColumn[]>>,
  CellRenderer: FC<{ selectedLevel: number }>
): (ColumnType<Record<string, unknown>> & { dataIndex: string })[] => {
  return _compact(
    data.table.columns
      .filter(
        (col) => !expandColumns.map((expand) => expand.column).includes(col)
      )
      .map((column) =>
        column === GROUP_COLUMN
          ? undefined
          : {
              title:
                column === SCENARIO_COLUMN ? (
                  <ExpandColumnHeader
                    setExpandColumns={setExpandColumns}
                    expandColumns={[
                      ...expandColumns,
                      {
                        column: SCENARIO_COLUMN,
                        position: -1,
                        fields: [],
                        store: SCENARII_TABLE,
                      },
                    ]}
                  />
                ) : (
                  column
                ),
              dataIndex: column,
              align: getAlignment(column, data.metadata),
              render: (
                text: string | number | boolean | null,
                record: Record<string, unknown>
              ) => (
                <CellRenderer selectedLevel={record.selectedLevel as number}>
                  {String(text)}
                </CellRenderer>
              ),
            }
      )
  );
};

export const mergeBasicAndExpandFilters = (
  selectedFilters: SelectedFiltersType,
  expandColumns: ExpandColumn[]
): SelectedFiltersType => ({
  ...selectedFilters,
  ...expandColumns.reduce((acc, expandColumn) => {
    return {
      ...acc,
      [expandColumn.column]: Object.keys(selectedFilters).includes(
        expandColumn.column
      )
        ? [...selectedFilters[expandColumn.column], ...expandColumn.fields]
        : expandColumn.fields,
    };
  }, {}),
});

const buildTreeTableNodeWithChildren = (
  rows: Omit<TableData, "groupId">[],
  expandColumns: ExpandColumn[],
  expandIteration: number
): InvestigationTableData[] => {
  const currentExpandColumn =
    expandIteration === -1
      ? SCENARIO_COLUMN
      : (expandColumns.find((expand) => expand.position === expandIteration)
          ?.column as string);
  const nextExpandColumn = expandColumns.find(
    (expand) => expand.position === expandIteration + 1
  )?.column;
  const node: InvestigationTableData[] =
    expandIteration === expandColumns.length - 1
      ? rows.map((row) => ({
          ...row,
          [SCENARIO_COLUMN]: String(row[currentExpandColumn]),
          selectedLevel: expandIteration,
        }))
      : Object.entries(_groupBy(rows, currentExpandColumn)).map(
          ([currentExpandField, rowsGroup]): any => ({
            selectedLevel: expandIteration,

            // Make "Total" row becomes parent node.
            ...(rows.find((row) =>
              nextExpandColumn === undefined
                ? false
                : row[nextExpandColumn] === "Total" &&
                  row[currentExpandColumn] === currentExpandField
            ) || {}),

            // Make all other rows than "Total" becomes children nodes.
            children: buildTreeTableNodeWithChildren(
              rowsGroup.filter((row) =>
                nextExpandColumn === undefined
                  ? true
                  : row[nextExpandColumn] !== "Total"
              ),
              expandColumns,
              expandIteration + 1
            ),

            // Merge expanded columns into one tree column ("scenario" column).
            [SCENARIO_COLUMN]: currentExpandField,
          })
        );
  return node;
};

export const getTreeTable = (
  rows: TableData[],
  expandColumns: ExpandColumn[]
): (TableData | InvestigationTableData)[] => {
  let expandIteration = -1;

  const newTable = _isEmpty(expandColumns)
    ? rows
    : buildTreeTableNodeWithChildren(rows, expandColumns, expandIteration);

  return newTable;
};

export const getInvestigationTableDataFromFetchedData = (
  data: FetchedData,
  measuresSettings: Record<string, FormattingData>,
  groupId: string,
  expandColumns: ExpandColumn[]
) => {
  const tableDataByGroup = getTableDataByGroup(data, measuresSettings);
  const tableData = getTreeTable(tableDataByGroup[groupId], expandColumns);

  return tableData;
};

export const hasResults = (
  results: FetchedData | Record<string, never>
): results is FetchedData => !_isEmpty(results);
