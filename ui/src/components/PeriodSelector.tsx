import React, { Dispatch, FC, SetStateAction, useMemo } from "react";

import { FormInstance } from "antd/es/form/Form";
import Form from "antd/lib/form";
import { useWatch } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Select, { DefaultOptionType } from "antd/lib/select";
import { FieldData } from "rc-field-form/lib/interface";
import { PeriodField } from "../types";
import { useFiltersFromColumns } from "../hooks";
import { getSelectOptionsFromSet } from "../dataFormatting/utils";
import { SCENARII_TABLE } from "../config";
import Alert from "antd/lib/alert";

const { Item } = Form;

const PERIOD_FIELD = "periodField";
const PERIOD_VALUE = "periodValue";

interface FormInterface {
  periodField: string;
  periodValue: string;
}

const PeriodSelector: FC<{
  periodForm: FormInstance<FormInterface>;
  setSelectedPeriod: Dispatch<
    SetStateAction<Required<PeriodField> | undefined>
  >;
  periodFields: DefaultOptionType[];
}> = ({ periodForm, setSelectedPeriod, periodFields }) => {
  const periodField = useWatch(PERIOD_FIELD, periodForm);

  const periodValuesToLoad = useMemo(
    () => [{ store: SCENARII_TABLE, values: [periodField] }],
    [periodField]
  );

  const {
    isLoadingFilters: isLoadingPeriods,
    filtersByColumn: fetchedPeriods,
  } = useFiltersFromColumns(periodValuesToLoad);

  const periodOptions = getSelectOptionsFromSet(
    fetchedPeriods.get(periodField)
  );

  const submitForm = (_changedFields: FieldData[], allFields: FieldData[]) => {
    const inputsValue = periodForm.getFieldsValue(
      allFields.map((item) => item.name)
    );
    periodForm.setFieldsValue(inputsValue);
    setSelectedPeriod({
      field: inputsValue.periodField,
      value: inputsValue.periodValue,
    });
  };

  return (
    <div className="period-selector">
      {periodForm.getFieldValue(PERIOD_VALUE) === undefined && (
        <Alert
          message="Select a period."
          type="info"
          showIcon
          className="period-selector-alert"
        />
      )}
      {periodFields.length === 0 ? (
        <div>No period.</div>
      ) : (
        <Form
          layout="inline"
          onFieldsChange={submitForm}
          form={periodForm}
          initialValues={{ periodField: periodFields[0].label }}
          style={{ marginTop: 8 }}
        >
          <Input.Group compact>
            <Item label="Period" name={PERIOD_FIELD}>
              <Select
                style={{ width: 160 }}
                size="small"
                options={periodFields}
                onChange={() => periodForm.resetFields([PERIOD_VALUE])}
              ></Select>
            </Item>
            <Item name={PERIOD_VALUE}>
              <Select
                loading={isLoadingPeriods}
                style={{ width: 160 }}
                size="small"
                options={periodOptions}
              ></Select>
            </Item>
          </Input.Group>
        </Form>
      )}
    </div>
  );
};

export default PeriodSelector;
