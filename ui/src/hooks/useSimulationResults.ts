import { useEffect, useState } from "react";
import _isEmpty from "lodash/isEmpty";
import { FetchedData, FormattedMetaData } from "../network/types";
import { fetchSimulationResults } from "../network";
import { Groups, PeriodField } from "../types";
import { Measure } from "@squashql/squashql-js";
import { PERIODS } from "../config";
import { SelectedFiltersType } from "../contexts/FiltersContext";

const hasResults = (
  results: FetchedData | Record<string, never>
): results is FetchedData => !_isEmpty(results);

export const useSimulationResults = (
  groups: Groups,
  selectedMeasures: Measure[],
  discoveryData: FormattedMetaData,
  options: {
    selectedPeriod?: Required<PeriodField>;
    selectedFilters?: SelectedFiltersType;
  } = {}
) => {
  const { selectedPeriod, selectedFilters } = options;
  const [isLoadingSimulationResults, setLoadingSimulationResults] =
    useState<boolean>(false);
  const [simulationResults, setSimulationResults] = useState<FetchedData>();

  const getSimulationResults = async () => {
    setLoadingSimulationResults(true);

    try {
      const fetchedSimulationResults = await fetchSimulationResults(
        groups,
        selectedMeasures,
        { selectedFilters }
      );

      if (hasResults(fetchedSimulationResults)) {
        setSimulationResults(fetchedSimulationResults);
      }
    } finally {
      setLoadingSimulationResults(false);
    }
  };

  useEffect(() => {
    if (
      (selectedPeriod?.field !== undefined &&
        selectedPeriod?.value !== undefined) ||
      PERIODS === null
    ) {
      if (_isEmpty(groups)) {
        setSimulationResults(undefined);
      } else {
        getSimulationResults();
      }
    }
  }, [
    groups,
    selectedPeriod,
    discoveryData,
    selectedMeasures,
    selectedFilters,
  ]);

  return { isLoadingSimulationResults, simulationResults };
};
