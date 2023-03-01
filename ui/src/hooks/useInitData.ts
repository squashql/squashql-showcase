import { useContext, useEffect, useState } from "react";
import {
  defaultFormattingData,
  getAllMeasuresSettingsFromLocalStorage,
} from "../components/MeasureSettings/utils";
import LocalStorageContext from "../contexts/LocalStorageContext";
import { formatDiscoveryData } from "../dataFormatting";
import {
  fetchDiscoveryData,
  fetchScenarii,
  FormattedMetaData,
} from "../network";

export const useInitData = () => {
  const { initMeasursesSettings, initSavedQueries, setMeasuresSettings } =
    useContext(LocalStorageContext);
  const [isLoadingList, setLoadingList] = useState<boolean>(false);
  const [isLoadingDiscoveryData, setLoadingDiscoveryData] =
    useState<boolean>(false);
  const [discoveryData, setDiscoveryData] = useState<FormattedMetaData>({
    aggregations: [],
    filters: [],
    fields: [],
    measures: [],
    numbers: [],
    periods: [],
    stores: [],
  });
  const [listData, setListData] = useState<string[]>([]);

  const loadDiscoveryData = async () => {
    setLoadingDiscoveryData(true);
    try {
      const fetchedDiscoveryData = await fetchDiscoveryData();

      if (fetchedDiscoveryData) {
        const formattedDiscoveryData =
          formatDiscoveryData(fetchedDiscoveryData);

        const mesuresSettingsFromLocalStorage =
          getAllMeasuresSettingsFromLocalStorage();

        let newMeasuresSettings = {};

        formattedDiscoveryData.measures.forEach((measure) => {
          if (mesuresSettingsFromLocalStorage[measure.alias] === undefined) {
            Object.assign(newMeasuresSettings, {
              [measure.alias]: defaultFormattingData,
            });
          }
        });

        setMeasuresSettings((previousState) => ({
          ...previousState,
          ...newMeasuresSettings,
        }));

        setDiscoveryData(formattedDiscoveryData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDiscoveryData(false);
    }
  };

  const loadScenariiList = async () => {
    setLoadingList(true);
    try {
      const fetchedScenarii = await fetchScenarii();
      if (fetchedScenarii) {
        setListData(fetchedScenarii);
      }
    } catch (error) {
      console.error(`Can't get scenarii list. ${error}`);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    initMeasursesSettings();
    initSavedQueries();
    loadDiscoveryData();
    loadScenariiList();
  }, []);

  return { isLoadingList, isLoadingDiscoveryData, listData, discoveryData };
};
