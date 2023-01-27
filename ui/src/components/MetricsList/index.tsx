import React, { FC, useContext, useState } from "react";

import { grey } from "@ant-design/colors";
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined";
import List from "antd/lib/list";
import Tooltip from "antd/lib/tooltip";
import { Measure } from "@squashql/squashql-js";
import _sortBy from "lodash/sortBy";

import MetricSettings from "../MeasureSettings";
import Title from "../Title";
import "./style.css";
import LocalStorageContext from "../../contexts/LocalStorageContext";

const TooltipContent: FC<{
  item: Measure;
}> = ({ item }) => {
  const { measuresSettings } = useContext(LocalStorageContext);
  const measureSettings = measuresSettings[item.alias];

  return (
    <small>
      <div className="metric-metadata-tooltip-content">
        <div>Format</div>
        <div>{measureSettings?.format}</div>
        <div>Table rounding</div>
        <div>{measureSettings?.tableRounding}</div>
        <div>Chart rounding</div>
        <div>{measureSettings?.chartRounding} </div>
      </div>
    </small>
  );
};

const MetricsList: FC<{
  measures: Measure[];
}> = ({ measures }) => {
  const [isModalVisible, setModalVisibility] = useState<boolean>(false);
  const [selectedMeasure, selectMeasure] = useState<string>();

  const showModal = (measure: string) => {
    setModalVisibility(true);
    selectMeasure(measure);
  };
  const closeModal = () => {
    setModalVisibility(false);
  };

  const sortedMeasures = _sortBy(measures, ["alias"]);

  return (
    <div className="measures-list">
      <MetricSettings {...{ selectedMeasure, isModalVisible, closeModal }} />
      <Title>Metrics Library</Title>

      <List
        className="metric-list"
        size="small"
        itemLayout="vertical"
        dataSource={sortedMeasures}
        renderItem={(measure) => (
          <Tooltip
            key={measure.alias}
            overlay={<TooltipContent item={measure} />}
            placement="right"
          >
            <List.Item
              extra={
                <SettingOutlined
                  onClick={() => showModal(measure.alias)}
                  style={{ color: grey[0] }}
                />
              }
            >
              <List.Item.Meta
                style={{ margin: 0 }}
                description={
                  <>
                    <div className="measure-name" style={{ color: grey[7] }}>
                      {measure.alias}
                    </div>
                    <small className="measure-expression">
                      {measure.expression}
                    </small>
                  </>
                }
              />
            </List.Item>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default MetricsList;
