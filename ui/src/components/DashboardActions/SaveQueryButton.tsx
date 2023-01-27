import React, { FC, useContext } from "react";

import { SaveOutlined } from "@ant-design/icons";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input/Input";
import Popover from "antd/lib/popover";

import LocalStorageContext from "../../contexts/LocalStorageContext";
import SelectionContext from "../../contexts/SelectionContext";
import PeriodContext from "../../contexts/PeriodContext";

const { Item } = Form;

const SaveQueryButton: FC<{}> = () => {
  const { setSavedQueries } = useContext(LocalStorageContext);
  const { selectedPeriod } = useContext(PeriodContext);
  const { selectedMeasures, groups } = useContext(SelectionContext);

  const onSubmit = ({ dashboardName }: Record<string, string>) => {
    if (dashboardName !== "") {
      setSavedQueries((previousState) => ({
        ...previousState,
        [dashboardName]: {
          groups,
          measures: selectedMeasures,
          period: selectedPeriod,
        },
      }));
    }
  };

  return (
    <Popover
      trigger="click"
      content={
        // TODO: Warning if already exists.
        <Form
          onFinish={onSubmit}
          layout="vertical"
          size="small"
          style={{ width: 160 }}
        >
          <Item label="Name the dashboard:" name="dashboardName">
            <Input autoComplete="false" />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save dashboard
            </Button>
          </Item>
        </Form>
      }
    >
      <Button icon={<SaveOutlined />} size="small">
        Save dashboard
      </Button>
    </Popover>
  );
};

export default SaveQueryButton;
