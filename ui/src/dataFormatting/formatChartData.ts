import _flatten from "lodash/flatten";
import _groupBy from "lodash/groupBy";
import { GROUP_COLUMN, SCENARIO_COLUMN } from "../config";
import { FetchedData } from "../network/types";
import { ChartData } from "../components/Charts/types";
import { getIndex } from "./utils";

export const formatChartData = (
  data: FetchedData,
  period: { field: string; value: string }
): ChartData => {
  const {
    table: { columns, rows },
  } = data;
  const groupColumnIndex = getIndex(columns, GROUP_COLUMN);
  const scenarioColumnIndex = getIndex(columns, SCENARIO_COLUMN);
  const periodColumnIndex =
    period !== undefined ? getIndex(columns, period.field) : 0;

  const rowsForSelectedPeriod =
    period !== undefined
      ? rows.filter((row) => row[periodColumnIndex] === Number(period.value))
      : rows;

  const flattenedResultsByScenario = rowsForSelectedPeriod.map((scenario) =>
    scenario.map((result, index) => ({
      groupId: scenario[groupColumnIndex] as string,
      [SCENARIO_COLUMN]: scenario[scenarioColumnIndex] as string,
      id: `${scenario[groupColumnIndex]}--${scenario[scenarioColumnIndex]}`,
      measure: columns[index],
      result: result as number,
    }))
  );
  const resultsColumns = flattenedResultsByScenario.map((scenario) =>
    scenario.filter(
      (_row, index) =>
        index !== groupColumnIndex &&
        index !== scenarioColumnIndex &&
        index !== periodColumnIndex
    )
  );

  const flattenedData = _flatten(resultsColumns);

  const dataByMetric = _groupBy(flattenedData, "measure");

  const dataByMetricByGroup = Object.entries(dataByMetric).reduce(
    (acc, [measureName, measureResults]) => ({
      ...acc,
      [measureName]: _groupBy(measureResults, "groupId"),
    }),
    {}
  );

  return dataByMetricByGroup;
};
