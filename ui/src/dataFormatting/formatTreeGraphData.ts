import { FetchedData, FetchedMetaDatum, Row } from "../network/types";
import _flatten from "lodash/flatten";
import _set from "lodash/set";
import _omit from "lodash/omit";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

import { getIndex, isBucketComparison, wrapLongText } from "./utils";
import { getColor, getIcon } from "../components/ScenariiGroupingTree/utils";
import { GROUP_COLUMN, SCENARIO_COLUMN } from "../config";
import {
  FormattingData,
  GroupsParamsInterface,
  PeriodField,
  ScenarioTreeGraphData,
  TreeGraphMeasureInfo,
} from "../types";
import { formatChartNumber } from "./formatNumber";
import { Measure } from "@squashql/squashql-js";

export const rootScenarioNode = {
  id: "root",
  scenarioName: "root",
  value: { title: "root", items: [{ text: "root", value: 0 }] },
  children: [],
};

const getScenarioResultsFromColumns = (
  scenario: Row,
  columns: FetchedData["table"]["columns"],
  selectedMeasures: Measure[],
  metadata: FetchedMetaDatum[],
  measuresSettings: Record<string, FormattingData>,
  options?: { periodField?: string; selectedFilterColumns?: string[] }
): ScenarioTreeGraphData["value"]["items"] => {
  const scenarioColumnIndex = getIndex(columns, SCENARIO_COLUMN);
  const groupColumnIndex = getIndex(columns, GROUP_COLUMN);
  const periodColumnIndex = options?.periodField
    ? getIndex(columns, options?.periodField)
    : null;
  const selectedFilterColumnsIndices =
    options?.selectedFilterColumns !== undefined
      ? options.selectedFilterColumns.map((filter) => getIndex(columns, filter))
      : [];

  const formattedResults = columns
    .map((columnName, columnIndex) => {
      if (
        columnIndex !== groupColumnIndex &&
        columnIndex !== scenarioColumnIndex &&
        columnIndex !== periodColumnIndex &&
        !selectedFilterColumnsIndices.includes(columnIndex)
      ) {
        const measureMetaData = metadata.find(
          (metadatum) => metadatum.name === columnName
        );

        const measure = {
          value: formatChartNumber(
            scenario[columnIndex] as number | null,
            measuresSettings[columns[columnIndex]]
          ),
          name: columnName,
          type: measureMetaData?.type,
          expression: measureMetaData?.expression || "(no expression)",
        };

        // TODO: Clean type.
        const info: Omit<TreeGraphMeasureInfo, "isDifference" | "legendColor"> =
          {
            // TODO: Remove: Duplicate with name.
            text: columnName,
            comparisonMethod: _get(
              selectedMeasures.find((item) => item.alias === columnName),
              "comparisonMethod"
            ),
            ...measure,
          };

        // TODO: Clean.
        return info.comparisonMethod
          ? { ...info, ...getIcon(scenario[columnIndex] as number) }
          : _omit(info, "method");
      } else {
        return undefined;
      }
    })
    .filter((item) => item !== undefined) as TreeGraphMeasureInfo[];

  let measuresToDelete: string[] = [];

  const resultsGroupedByMeasure = formattedResults.map((item) => {
    const measureMetaData = selectedMeasures.find(
      (measure) => measure.alias === item.text
    );

    if (isBucketComparison(measureMetaData)) {
      const measureUsedInComparison = selectedMeasures.find(
        (selectedMeasure) =>
          selectedMeasure.alias === _get(measureMetaData, "measure.alias")
      );

      if (measureUsedInComparison?.alias !== undefined) {
        measuresToDelete.push(measureUsedInComparison.alias);
      }

      const measureTreeGraphInfo = formattedResults.find(
        (result) => result.text === measureUsedInComparison?.alias
      );

      return {
        ...item,
        isDifference: true,
        comparedMeasure: measureTreeGraphInfo,
      };
    } else {
      return { ...item, isDifference: false };
    }
  });

  const cleanedResults =
    measuresToDelete.length === 0
      ? resultsGroupedByMeasure
      : resultsGroupedByMeasure.filter(
          (result) => !measuresToDelete.includes(result.text)
        );

  const resultsWithLegendColor = cleanedResults.map((result, index) => ({
    ...result,
    legendColor: getColor(index),
    comparedMeasure: result.comparedMeasure
      ? { ...result.comparedMeasure, legendColor: getColor(index) }
      : undefined,
  }));

  return resultsWithLegendColor;
};

/**
 * Merge duplicated paths of scenarii.
 * @param data
 * ```
 * [
 *   {
 *     id: "group1--scenario-1",
 *     children: [
 *       {
 *         id: "group1--scenario-2",
 *         children: [],
 *       },
 *     ],
 *   },
 *   {
 *     id: "group2--scenario-1",
 *     children: [
 *       {
 *         id: "group2--scenario-4",
 *         children: [],
 *       },
 *     ],
 *   },
 * ]
 * ```
 * @returns
 * ```
 * [
 *   {
 *     id: "group1--scenario-1",
 *     children: [
 *       {
 *         id: "group1--scenario-2",
 *         children: [],
 *       },
 *       {
 *         id: "group2--scenario-4",
 *         children: [],
 *       },
 *     ],
 *   },
 * ]
 * ```
 */

interface TempNode {
  content: ScenarioTreeGraphData;
  path: string;
}

type TempNodeWithChildren = TempNode & {
  [scenarioName: string]: TempNode | undefined;
};

const setChildrenNodes = (
  currentNode: TempNodeWithChildren | TempNode
): ScenarioTreeGraphData => {
  const { content } = currentNode;
  const previousChildren = content.children || [];
  const newChildren = _omit(currentNode, ["content", "path"]);
  const newChildrenValues = Object.values(newChildren) || [];

  let formattedNewChildren: ScenarioTreeGraphData[] = [];
  newChildrenValues.forEach((item) => {
    // TODO: Clean type & if.
    if (item !== undefined && item !== null && !_isEmpty(item)) {
      formattedNewChildren.push(
        setChildrenNodes(item as TempNode | TempNodeWithChildren)
      );
    }
  });

  const node = {
    ...content,
    children: [...previousChildren, ...formattedNewChildren],
  };

  return node;
};

export const formatTreeGraphScenarii = (
  { columns, rows }: FetchedData["table"],
  selectedMeasures: Measure[],
  groupsOrder: GroupsParamsInterface["values"],
  metadata: FetchedMetaDatum[],
  measuresSettings: Record<string, FormattingData>,
  options?: {
    selectedPeriod?: Required<PeriodField>;
    selectedFilterColumns?: string[];
  }
): ScenarioTreeGraphData => {
  const selectedPeriod = options?.selectedPeriod;
  const scenarioColumnIndex = getIndex(columns, SCENARIO_COLUMN);
  // TODO: Add ability for the user to name the groups.
  const groupColumnIndex = getIndex(columns, GROUP_COLUMN);
  const periodColumnIndex =
    selectedPeriod !== undefined ? getIndex(columns, selectedPeriod.field) : 0;

  const rowsWithoutPeriods =
    selectedPeriod !== undefined
      ? rows.filter((row) => row[periodColumnIndex] === selectedPeriod.value)
      : rows;

  let allNodes = [];

  for (const groupName in groupsOrder) {
    const scenarii = groupsOrder[groupName];

    const nodesOfAGroup = scenarii.reduce(
      (
        scenariiNodes: Array<{ content: ScenarioTreeGraphData; path: string }>,
        scenario,
        index
      ): Array<{ content: ScenarioTreeGraphData; path: string }> => {
        const scenarioResults = rowsWithoutPeriods.find(
          (row) =>
            row[scenarioColumnIndex] === scenario &&
            row[groupColumnIndex] === groupName
        );

        if (scenarioResults === undefined) {
          return scenariiNodes;
        }

        const groupId = scenarioResults[groupColumnIndex] as string;

        const node = {
          content: {
            children: [],
            id: `${groupId}--${scenarioResults[scenarioColumnIndex]}`,
            scenarioName: scenarioResults[scenarioColumnIndex] as string,
            value: {
              groupId,
              items: getScenarioResultsFromColumns(
                scenarioResults,
                columns,
                selectedMeasures,
                metadata,
                measuresSettings,
                {
                  periodField: selectedPeriod?.field,
                  selectedFilterColumns: options?.selectedFilterColumns,
                }
              ),
              title: wrapLongText(
                26,
                scenarioResults[scenarioColumnIndex] as string
              ),
            },
          },

          path:
            scenariiNodes[index - 1] !== undefined
              ? scenariiNodes[index - 1].path + "." + scenarii[index - 1]
              : "root",
        };

        return [...scenariiNodes, node];
      },
      []
    );

    allNodes.push(nodesOfAGroup);
  }

  allNodes = _flatten(allNodes);
  allNodes = allNodes.sort((a, b) => {
    const matchA = a?.path?.match(/\./g);
    const matchB = b?.path?.match(/\./g);
    const matchALength = matchA?.length || 0;
    const matchBLength = matchB?.length || 0;

    return matchALength - matchBLength;
  });

  const tree = { root: { content: rootScenarioNode, path: "" } };

  allNodes.forEach((node) => {
    _set(tree, node.path + "." + node.content.scenarioName, node);
  });

  const formattedTree = setChildrenNodes(tree.root);

  return formattedTree;
};

export const getGraphScenarii = (
  data: FetchedData,
  selectedMeasures: Measure[],
  groups: GroupsParamsInterface["values"],
  measuresSettings: Record<string, FormattingData>,
  options?: {
    selectedPeriod?: Required<PeriodField>;
    selectedFilterColumns?: string[];
  }
): ScenarioTreeGraphData => {
  const { metadata, table } = data;

  const treeGraphScenarii =
    table.rows === undefined || table.columns.length === 0
      ? rootScenarioNode
      : formatTreeGraphScenarii(
          table,
          selectedMeasures,
          groups,
          metadata,
          measuresSettings,
          options
        );

  return treeGraphScenarii;
};
