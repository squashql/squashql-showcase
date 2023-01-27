import { Measure } from "@squashql/squashql-js";
import { createContext, Dispatch, SetStateAction } from "react";
import { getAllMeasuresSettingsFromLocalStorage } from "../components/MeasureSettings/utils";
import { FormattingData, Groups, PeriodField } from "../types";

export interface SavedQuery {
  groups: Groups;
  measures: Measure[];
  period?: Required<PeriodField>;
}

export const QUERIES_LOCAL_STORAGE_KEY = "aitm-saved-queries";

export const getSavedQueriesFromLocalStorage = (): Record<
  string,
  SavedQuery
> => {
  const savedQueries = localStorage.getItem(QUERIES_LOCAL_STORAGE_KEY);
  const parsedSavedQueries = JSON.parse(savedQueries || "{}");
  return parsedSavedQueries;
};

export const saveQueryInLocalStorage = (
  queryToSave: Record<string, SavedQuery>
) => {
  const savedQueries = getSavedQueriesFromLocalStorage();
  const newSavedQueries = { ...savedQueries, ...queryToSave };
  localStorage.setItem(
    QUERIES_LOCAL_STORAGE_KEY,
    JSON.stringify(newSavedQueries)
  );
};

export interface LocalStorageContextInterface {
  initMeasursesSettings: () => void;
  initSavedQueries: () => void;
  measuresSettings: Record<string, FormattingData>;
  setMeasuresSettings: Dispatch<SetStateAction<{}>>;
  savedQueries: Record<string, SavedQuery>;
  setSavedQueries: Dispatch<SetStateAction<{}>>;
}

export const initialLocalStorageContextValue = {
  initMeasursesSettings: () => {},
  initSavedQueries: () => {},
  measuresSettings: getAllMeasuresSettingsFromLocalStorage(),
  setMeasuresSettings: () => {},
  savedQueries: getSavedQueriesFromLocalStorage(),
  setSavedQueries: () => {},
};

const LocalStorageContext = createContext<LocalStorageContextInterface>(
  initialLocalStorageContextValue
);

export default LocalStorageContext;
