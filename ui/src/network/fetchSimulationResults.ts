import _flatten from "lodash/flatten";
import _isEmpty from "lodash/isEmpty";
import _sortBy from "lodash/sortBy";
import {
  BucketColumnSet,
  ColumnSet,
  from,
  Measure,
  Querier,
  Query,
} from "@squashql/squashql-js";
import {
  GROUP_COLUMN,
  SCENARIO_COLUMN,
  ROOT_URL,
  measureDescriptions,
  YEAR_COLUMN,
} from "../config";
import { Groups } from "../types";
import { FetchedData } from "./types";
import {
  createQueryWithFilters,
  mergeQueryResults,
  removeDuplicatedColumns,
} from "./utils";
import { ExpandColumn } from "../components/Investigation/types";
import { mergeBasicAndExpandFilters } from "../components/Investigation/utils";

const querier = new Querier(ROOT_URL);

const getResultForEmptyMeasures = (groups: Groups) => ({
  table: {
    columns: [GROUP_COLUMN, SCENARIO_COLUMN],
    rows: _flatten(
      Object.entries(groups).map(([group, scenarii]) =>
        scenarii.map((scenario) => [group, scenario])
      )
    ),
  },
  metadata: [],
});

// TODO: Simplify for demo codebase.
export const fetchSimulationResults = async (
  groups: Groups,
  selectedMeasures: Measure[],
  options: {
    selectedFilters?: Record<string, string[]>;
    expandColumns?: ExpandColumn[];
  }
): Promise<FetchedData | Record<string, never>> => {
  if (selectedMeasures.length <= 0) {
    return getResultForEmptyMeasures(groups);
  }

  const { expandColumns = [], selectedFilters = {} } = options;
  // TODO: Synchronize basic filters in expand feature to avoid merge.
  const mergedFilters = mergeBasicAndExpandFilters(
    selectedFilters,
    expandColumns
  );

  let columns: string[] = [];
  const columnSets: ColumnSet[] = [
    new BucketColumnSet(
      GROUP_COLUMN,
      SCENARIO_COLUMN,
      new Map(Object.entries(groups))
    ),
  ];

  if (YEAR_COLUMN !== null) {
    columns.unshift(YEAR_COLUMN);
  }

  let queries: Query[] = [];

  measureDescriptions.forEach(
    ({ from: source, measures, comparisonMeasures }) => {
      let selectedMeasuresDescriptions = [
        ...measures,
        ...comparisonMeasures,
      ].filter((measure) =>
        selectedMeasures.map((m) => m.alias).includes(measure.alias)
      );
      if (selectedMeasuresDescriptions.length > 0) {
        let query;

        const expandColumnsStrings = _flatten(
          expandColumns.map((expand) => expand.column)
        );
        columns.push(...expandColumnsStrings);

        if (!_isEmpty(mergedFilters)) {
          query = createQueryWithFilters({
            selectedFilters,
            tableToFilter: source,
          });
        } else {
          query = from(source);
        }

        queries = [
          ...queries,
          expandColumns.length > 0
            ? query
                .select(columns, columnSets, selectedMeasuresDescriptions)
                .rollup([
                  SCENARIO_COLUMN,
                  ..._sortBy(expandColumns, "position").map(
                    (expand) => expand.column
                  ),
                ])
                .build()
            : query
                .select(columns, columnSets, selectedMeasuresDescriptions)
                .build(),
        ];
      }
    }
  );

  const response = await Promise.all(
    queries.map((query) => querier.execute(query))
  );

  // TODO: Merge results in backend.
  const results = mergeQueryResults(response);
  const responseWithoutDuplicate = removeDuplicatedColumns(results);

  return responseWithoutDuplicate;
};
