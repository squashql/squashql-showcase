import _mergeWith from "lodash/mergeWith";
import _isArray from "lodash/isArray";
import { QueryResult, MetadataResult } from "@squashql/squashql-js";

export const mergeQueryResults = (results: QueryResult[]): QueryResult => {
  return results.reduce(
    (acc, response) => _mergeWith(acc, response, mergeArrays),
    {} as QueryResult
  );
};

const removeIndices = (
  arrayTofilter: any[],
  indicesToRemove: number[]
): any[] =>
  arrayTofilter.filter(
    (_item, columnIndex) => !indicesToRemove.includes(columnIndex)
  );

export const removeDuplicatedColumns = (
  result: QueryResult | Record<string, never>
): QueryResult | Record<string, never> => {
  const { table, metadata } = result;

  if (table) {
    const { columns, rows } = table;
    let duplicatedColumns: number[] = [];

    columns.forEach((column, columnIndex, columns) => {
      const remainingColumnsToTest = columns.slice(
        columnIndex + 1,
        columns.length
      );
      if (remainingColumnsToTest.includes(column)) {
        // Push second match of column to keep simulation and group columns at first positions.
        duplicatedColumns.push(
          remainingColumnsToTest.findIndex((item) => item === column) +
            columnIndex +
            1
        );
      }
    });

    return {
      ...(result as QueryResult),
      metadata: removeIndices(metadata, duplicatedColumns),
      table: {
        columns: removeIndices(columns, duplicatedColumns),
        rows: rows.map((row) => removeIndices(row, duplicatedColumns)),
      },
    };
  } else {
    return result;
  }
};

const mergeArrays = (value: any[], srcValue: any[]) => {
  if (_isArray(value)) {
    if (_isArray(value[0]) && _isArray(srcValue[0])) {
      return value.map((innerArray, index) =>
        innerArray.concat(srcValue[index])
      );
    }
    return value.concat(srcValue);
  }
};

// TODO: Manage case where columns have the same name in different stores.
export const findStoreFromColumn = (
  column: string,
  stores: MetadataResult["stores"]
): string | undefined => {
  const storeToFind = stores.find((store) =>
    store.fields.map((field) => field.name).includes(column)
  );

  return storeToFind?.name;
};
