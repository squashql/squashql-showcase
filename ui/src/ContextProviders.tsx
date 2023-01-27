import React, { FC, useState } from "react";

import { Measure } from "@squashql/squashql-js";
import Form from "antd/lib/form";

import LocalStorageContext, {
  getSavedQueriesFromLocalStorage,
  SavedQuery,
} from "./contexts/LocalStorageContext";
import SelectionContext from "./contexts/SelectionContext";
import { FormattingData, Groups, PeriodField } from "./types";
import { getAllMeasuresSettingsFromLocalStorage } from "./components/MeasureSettings/utils";
import { PERIODS } from "./config";
import { PeriodContextProvider } from "./contexts/PeriodContext";
import FiltersContext from "./contexts/FiltersContext";

const ContextProviders: FC = ({ children }) => {
  const [periodForm] = Form.useForm();
  const [groups, setGroups] = useState<Groups>({});
  const [selectedMeasures, setSelectedMeasures] = useState<Measure[]>([]);

  const [measuresSettings, setMeasuresSettings] = useState<
    Record<string, FormattingData>
  >({});
  const [selectedPeriod, setSelectedPeriod] = useState<Required<PeriodField>>();
  const [savedQueries, setSavedQueries] = useState<Record<string, SavedQuery>>(
    {}
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const initMeasursesSettings = () => {
    const mesuresSettingsFromLocalStorage =
      getAllMeasuresSettingsFromLocalStorage();

    setMeasuresSettings(mesuresSettingsFromLocalStorage);
  };

  const initSavedQueries = () => {
    const savedQueriesFromLocalStorage = getSavedQueriesFromLocalStorage();

    setSavedQueries(savedQueriesFromLocalStorage);
  };

  const periodContextValue =
    PERIODS !== null
      ? {
          periodForm,
          selectedPeriod,
          setSelectedPeriod,
        }
      : null;

  return (
    <LocalStorageContext.Provider
      value={{
        initMeasursesSettings,
        initSavedQueries,
        measuresSettings,
        setMeasuresSettings,
        savedQueries,
        setSavedQueries,
      }}
    >
      <PeriodContextProvider value={periodContextValue}>
        <FiltersContext.Provider
          value={{
            selectedFilters,
            setSelectedFilters,
          }}
        >
          <SelectionContext.Provider
            value={{ groups, selectedMeasures, setGroups, setSelectedMeasures }}
          >
            {children}
          </SelectionContext.Provider>
        </FiltersContext.Provider>
      </PeriodContextProvider>
    </LocalStorageContext.Provider>
  );
};

export default ContextProviders;
