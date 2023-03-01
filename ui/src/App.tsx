import React, { useContext, useEffect, useState } from "react";
import Tabs from "antd/lib/tabs";
import Alert from "antd/lib/alert";

import "./App.css";
import {
  Charts,
  Investigation,
  Loading,
  PeriodSelector,
  Report,
  SaveQueryButton,
  ScenariiGroupingTree,
  SiderMenu,
} from "./components";
import { setMeasuresSettingsInLocalStorage } from "./components/MeasureSettings/utils";
import {
  InitDataContext,
  FiltersContext,
  LocalStorageContext,
  PeriodContext,
  SelectionContext,
} from "./contexts";
import { saveQueryInLocalStorage } from "./contexts/LocalStorageContext";
import { PERIODS } from "./config";
import { useInitData, useSimulationResults } from "./hooks";

const { TabPane } = Tabs;

const App = () => {
  const { measuresSettings, savedQueries } = useContext(LocalStorageContext);
  const { periodForm, selectedPeriod, setSelectedPeriod } =
    useContext(PeriodContext);
  const { groups, selectedMeasures, setGroups, setSelectedMeasures } =
    useContext(SelectionContext);
  const { selectedFilters } = useContext(FiltersContext);
  const { isLoadingList, isLoadingDiscoveryData, listData, discoveryData } =
    useInitData();

  const { isLoadingSimulationResults, simulationResults } =
    useSimulationResults(groups, selectedMeasures, discoveryData, {
      selectedPeriod,
      selectedFilters,
    });
  const [draggedScenario, setDraggedScenario] = useState<string>();
  const [investigatedGroupId, setInvestigatedGroupId] = useState<string>();
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("1");

  useEffect(() => {
    setMeasuresSettingsInLocalStorage(measuresSettings);
  }, [measuresSettings]);

  useEffect(() => {
    saveQueryInLocalStorage(savedQueries);
  }, [savedQueries]);

  const periodSelectorProps = {
    setSelectedPeriod: setSelectedPeriod,
    periodFields: discoveryData.periods.map((period) => ({
      label: period.name,
      value: period.name,
    })),
  };

  const initialValues = {
    metrics: selectedMeasures.map((measure) => measure.alias),
  };

  const onEdit = (
    targetKey:
      | string
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      setActiveTab(String(Number(targetKey) - 1));
      setInvestigatedGroupId(undefined);
    }
  };

  const onTabChange = (newActiveTab: string) => {
    setActiveTab(newActiveTab);
  };

  return (
    <InitDataContext.Provider value={{ discoveryData, listData }}>
      <div className="App">
        <SiderMenu
          isLoadingDiscoveryData={isLoadingDiscoveryData}
          setGroups={setGroups}
          setSelectedMeasures={setSelectedMeasures}
          setSelectedPeriod={setSelectedPeriod}
          discoveryData={discoveryData}
          initialValues={initialValues}
          setDraggedScenario={setDraggedScenario}
          listData={listData}
          isLoadingList={isLoadingList}
        />

        <Tabs
          type="editable-card"
          onEdit={onEdit}
          hideAdd={true}
          className="main-view"
          onChange={onTabChange}
          activeKey={activeTab}
          tabBarExtraContent={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <SaveQueryButton />
            </div>
          }
        >
          <TabPane
            closable={false}
            tab="Scenarii Grouping"
            key="1"
            className="scenarii-grouping-pane"
          >
            {periodForm !== undefined && (
              <PeriodSelector
                {...periodSelectorProps}
                periodForm={periodForm}
              />
            )}
            {(PERIODS === null || selectedPeriod?.value !== undefined) && (
              <Loading isLoading={isLoadingSimulationResults}>
                <ScenariiGroupingTree
                  simulationResults={simulationResults}
                  groups={groups}
                  setGroups={setGroups}
                  draggedScenario={draggedScenario}
                />
              </Loading>
            )}
          </TabPane>
          <TabPane closable={false} tab="Comparison by measure" key="2">
            {PERIODS !== null && periodForm !== undefined && (
              <PeriodSelector
                {...periodSelectorProps}
                periodForm={periodForm}
              />
            )}
            <Loading isLoading={isLoadingSimulationResults}>
              <Charts data={simulationResults} />
            </Loading>
          </TabPane>

          <TabPane
            closable={false}
            tab="Report"
            key="3"
            className="report-tab-pane"
          >
            <Loading isLoading={isLoadingSimulationResults}>
              <Report
                data={simulationResults}
                setInvestigatedGroupId={setInvestigatedGroupId}
                setIsInvestigating={setIsInvestigating}
                setActiveTab={setActiveTab}
              />
            </Loading>
          </TabPane>
          {investigatedGroupId !== undefined && (
            <TabPane
              closable={true}
              tab={`"${investigatedGroupId}" Investigation`}
              key="4"
              className="investigation-tab-pane"
            >
              <Investigation
                data={{
                  groupId: investigatedGroupId,
                  initData: simulationResults,
                }}
                isInvestigating={isInvestigating}
                setIsInvestigating={setIsInvestigating}
              />
            </TabPane>
          )}
        </Tabs>
      </div>
    </InitDataContext.Provider>
  );
};

export default App;
