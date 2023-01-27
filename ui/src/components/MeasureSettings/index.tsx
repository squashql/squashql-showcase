import React, { FC, useContext, useMemo } from "react";

import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { useWatch } from "antd/lib/form/Form";
import InputNumber from "antd/lib/input-number";
import Modal from "antd/lib/modal";
import Radio, { Group } from "antd/lib/radio";

import Title from "../Title";
import { FormattingData } from "../../types";
import { CURRENCY_SYMBOL } from "../../config";
import LocalStorageContext from "../../contexts/LocalStorageContext";
import { formatChartNumber, formatTableNumber } from "../../dataFormatting";

const { Item } = Form;

const numberToTest = 10_000_000.001;

const MeasureSettings: FC<{
  selectedMeasure?: string;
  isModalVisible: boolean;
  closeModal: () => void;
}> = ({ selectedMeasure, isModalVisible, closeModal }) => {
  const [form] = Form.useForm();
  const format = useWatch("format", form);
  const tableRounding = useWatch("tableRounding", form);
  const chartRounding = useWatch("chartRounding", form);
  const { measuresSettings, setMeasuresSettings } =
    useContext(LocalStorageContext);

  const onFinish = (allFields: FormattingData) => {
    if (selectedMeasure) {
      setMeasuresSettings((previousState) => ({
        ...previousState,
        [selectedMeasure]: allFields,
      }));
      form.resetFields();
      closeModal();
    }
  };

  const initialFormattingData = useMemo(
    () => (selectedMeasure ? measuresSettings[selectedMeasure] : {}),
    [selectedMeasure, measuresSettings]
  );

  return (
    <Modal
      width="33vw"
      style={{ minWidth: 450 }}
      title={
        <Title
          style={{ margin: 0 }}
        >{`Measure Settings for "${selectedMeasure}"`}</Title>
      }
      visible={isModalVisible}
      footer={null}
      onCancel={closeModal}
    >
      <Form
        name="measure-settings"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        form={form}
        initialValues={initialFormattingData}
      >
        <Item label="Format :" name="format">
          <Group>
            <Radio value="none">none</Radio>
            <Radio value="currency">{CURRENCY_SYMBOL}</Radio>
            <Radio value="percent">%</Radio>
          </Group>
        </Item>
        <Item label="Table Rounding :">
          <Item name="tableRounding" noStyle>
            <InputNumber size="small" min={-9} max={3} />
          </Item>
          <i>
            &nbsp;&nbsp;(preview:&nbsp;
            {formatTableNumber(numberToTest, {
              format,
              tableRounding,
            })}
            )
          </i>
        </Item>
        <Item label="Chart Rounding :">
          <Item name="chartRounding" noStyle>
            <InputNumber size="small" min={-9} max={3} />
          </Item>
          <i>
            &nbsp;&nbsp;(preview:&nbsp;
            {formatChartNumber(numberToTest, {
              format,
              chartRounding,
            })}
            )
          </i>
        </Item>
        <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
          Save Settings
        </Button>
      </Form>
    </Modal>
  );
};

export default MeasureSettings;
