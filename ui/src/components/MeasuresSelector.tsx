import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import Select from "antd/lib/select";
import Form from "antd/lib/form";
import _sortBy from "lodash/sortBy";
import _get from "lodash/get";
import { Measure } from "@squashql/squashql-js";

import { FieldData } from "../types";
import Title from "./Title";
import InitDataContext from "../contexts/InitDataContext";

const { Item } = Form;

const MeasuresSelector: FC<{
  setSelectedMeasures: Dispatch<SetStateAction<Measure[]>>;
  initialValues?: {
    metrics: string[];
  };
}> = ({ setSelectedMeasures, initialValues }) => {
  const [form] = Form.useForm();
  const { discoveryData } = useContext(InitDataContext);

  const submitForm = useCallback(
    (allFields: FieldData[]) => {
      const inputsValue = form.getFieldsValue(
        allFields.map((item) => item.name)
      );

      const newParams = discoveryData.measures.filter((measure) =>
        inputsValue.metrics?.some(
          (selectedMeasure: string) =>
            selectedMeasure === _get(measure, "alias")
        )
      );

      setSelectedMeasures(newParams);
    },
    [discoveryData, form]
  );

  const metricsOptions = useMemo(() => {
    return _sortBy(discoveryData.measures, ["alias"]).map((metric) => ({
      label: metric.alias,
      value: metric.alias,
      id: metric.alias,
    }));
  }, [discoveryData]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <>
      <Title>New Dashboard</Title>
      <Form
        name="measuresSelectionForm"
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Item label={<b>Select metrics:</b>} name="metrics">
          <Select
            maxTagTextLength={25}
            allowClear
            mode="multiple"
            size="small"
            onChange={submitForm}
            options={metricsOptions}
          />
        </Item>
      </Form>
    </>
  );
};

export default MeasuresSelector;
