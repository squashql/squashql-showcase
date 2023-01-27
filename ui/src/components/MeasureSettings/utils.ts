// TODO: Set measures settings on a DB instead of localStorage.

import { FormattingData } from "../../types";

const LOCAL_STORAGE_KEY = "aitm-measures-settings";

export const getAllMeasuresSettingsFromLocalStorage = (): Record<
  string,
  FormattingData
> => {
  const measureSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
  const parsedMeasureSettings: Record<string, FormattingData> = JSON.parse(
    measureSettings || "{}"
  );
  return parsedMeasureSettings;
};

export const setMeasuresSettingsInLocalStorage = (
  measures: Record<string, FormattingData>
) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(measures));
};

export const defaultFormattingData: FormattingData = {
  chartRounding: 1,
  format: "none",
  tableRounding: 2,
};
