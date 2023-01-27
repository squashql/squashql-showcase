import _get from "lodash/get";
import { PREVIOUS_SCENARIO, REFERENCE_POSITION } from "../../constants";
import { SCENARIO_COLUMN } from "../../config";
import { Measure } from "@squashql/squashql-js";

// TODO: Fix me.
export const isComparisonWithPrevious = (
  measureName: string,
  selectedMeasures: Measure[]
): boolean => {
  const measureToCheck =
    selectedMeasures.find((measure) => measure.alias === measureName) || {};

  // TODO: Extend to other possible comparisons.
  return (
    _get(measureToCheck, [REFERENCE_POSITION, SCENARIO_COLUMN]) ===
    PREVIOUS_SCENARIO
  );
};
