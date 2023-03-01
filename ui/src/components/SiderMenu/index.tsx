import React, { Dispatch, FC, SetStateAction } from "react";

import SettingOutlined from "@ant-design/icons/SettingOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import FolderOpenOutlined from "@ant-design/icons/FolderOpenOutlined";
import Tabs from "antd/lib/tabs";
import Tooltip from "antd/lib/tooltip";
import { Measure } from "@squashql/squashql-js";

import MetricsList from "../MetricsList";
import MeasuresSelector from "../MeasuresSelector";
import Loading from "../Loading";
import { FormattedMetaData } from "../../network";
import { Groups, PeriodField } from "../../types";
import List from "antd/lib/list";
import SavedDahboards from "../SavedDashboards";
import Filters from "../Filters";
import FilterOutlined from "@ant-design/icons/lib/icons/FilterOutlined";

const { TabPane: Pane } = Tabs;

interface SiderMenuProps {
  isLoadingDiscoveryData: boolean;
  setSelectedMeasures: Dispatch<SetStateAction<Measure[]>>;
  discoveryData: FormattedMetaData;
  initialValues?: { metrics: string[] };
  setGroups: Dispatch<SetStateAction<Groups>>;
  setSelectedPeriod: Dispatch<
    SetStateAction<Required<PeriodField> | undefined>
  >;
  setDraggedScenario: Dispatch<SetStateAction<string | undefined>>;
  listData: string[];
  isLoadingList: boolean;
}

const SiderMenu: FC<SiderMenuProps> = ({
  isLoadingDiscoveryData,
  setSelectedMeasures,
  discoveryData,
  initialValues,
  setGroups,
  setSelectedPeriod,
  setDraggedScenario,
  listData,
  isLoadingList,
}) => {
  const { measures, filters } = discoveryData;

  const items = [
    {
      label: "Create a dashboard",
      key: "1",
      icon: <EditOutlined />,
      children: (
        <Loading isLoading={isLoadingDiscoveryData || isLoadingList}>
          <div className="measures-selector">
            <MeasuresSelector
              setSelectedMeasures={setSelectedMeasures}
              initialValues={initialValues}
            />
            <div>
              <p>
                <b>Drag and drop scenarii:</b>
              </p>
              {listData.length === 0 ? (
                <div>No scenario.</div>
              ) : (
                <List
                  className="scenarii-list"
                  size="small"
                  dataSource={listData}
                  renderItem={(scenario) => (
                    <List.Item
                      className="list-scenario"
                      draggable
                      onDragStart={() => setDraggedScenario(scenario)}
                      key={scenario}
                    >
                      {scenario}
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        </Loading>
      ),
    },
    {
      label: "Filter dashboard",
      icon: <FilterOutlined />,
      key: "2",
      children: <Filters availableFilters={filters} />,
    },
    {
      label: "Open a dashboard",
      icon: <FolderOpenOutlined />,
      key: "3",
      children: (
        <SavedDahboards
          {...{
            setGroups,
            setSelectedPeriod,
            setSelectedMeasures,
          }}
        />
      ),
    },
    {
      label: "View metrics library",
      key: "4",
      icon: <SettingOutlined />,
      children: <MetricsList measures={measures} />,
    },
  ];

  return (
    <Tabs
      tabPosition="left"
      size="small"
      defaultActiveKey="1"
      className="sider-menu"
    >
      {items.map((item) => (
        <Pane
          style={{ padding: 0 }}
          tab={
            <Tooltip title={item.label} placement="right">
              {item.icon}
            </Tooltip>
          }
          key={item.key}
        >
          {item.children}
        </Pane>
      ))}
    </Tabs>
  );
};

export default SiderMenu;
