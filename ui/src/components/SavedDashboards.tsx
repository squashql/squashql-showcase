import React, { Dispatch, FC, SetStateAction, useContext } from "react";

import { grey } from "@ant-design/colors";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import Menu from "antd/lib/menu";
import { Measure } from "@squashql/squashql-js";
import _omit from "lodash/omit";

import LocalStorageContext from "../contexts/LocalStorageContext";
import { Groups, PeriodField } from "../types";
import Title from "./Title";
import Popconfirm from "antd/lib/popconfirm";

const { Item } = Menu;

interface SavedDashboardsProps {
  setGroups: Dispatch<SetStateAction<Groups>>;
  setSelectedPeriod: Dispatch<
    SetStateAction<Required<PeriodField> | undefined>
  >;
  setSelectedMeasures: Dispatch<SetStateAction<Measure[]>>;
}

const SavedDahboards: FC<SavedDashboardsProps> = ({
  setSelectedMeasures,
  setGroups,
  setSelectedPeriod,
}) => {
  const { savedQueries, setSavedQueries } = useContext(LocalStorageContext);

  const loadDashboard = (dashboardName: string) => {
    if (dashboardName !== "") {
      const queryToLoad = savedQueries[dashboardName];

      setSelectedPeriod(queryToLoad.period);
      setSelectedMeasures(queryToLoad.measures);
      setGroups(queryToLoad.groups);
    }
  };

  const deleteDashboard = (dashboardName: string) => {
    setSavedQueries((previousState) => ({
      ..._omit(previousState, dashboardName),
    }));
  };

  return (
    <div className="dashboards-list">
      <Title>Saved Dashboards</Title>
      <Menu>
        {Object.keys(savedQueries).map((dashboardName) => (
          <Item
            onClick={() => loadDashboard(dashboardName)}
            key={dashboardName}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
              }}
            >
              <span
                title={dashboardName}
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflowX: "hidden",
                }}
              >
                {dashboardName}
              </span>
              <Popconfirm
                title="Are you sure you want to delete this dashboard?"
                onConfirm={() => deleteDashboard(dashboardName)}
                okText="Delete"
                cancelText="Cancel"
              >
                <DeleteOutlined
                  style={{ color: grey[0] }}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                />
              </Popconfirm>
            </div>
          </Item>
        ))}
      </Menu>
    </div>
  );
};

export default SavedDahboards;
