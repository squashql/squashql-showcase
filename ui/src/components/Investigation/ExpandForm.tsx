import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import _isArray from "lodash/isArray";
import _flatten from "lodash/flatten";
import Select from "antd/lib/select";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useForm, useWatch } from "antd/lib/form/Form";

import { InitDataContext } from "../../contexts";
import { useFiltersFromColumns } from "../../hooks";
import Loading from "../Loading";
import { ExpandColumn } from "./types";
import {
  getSelectOptionsFromSet,
  parseNull,
  stringifyNull,
} from "../../dataFormatting/utils";

const { Item } = Form;
const { OptGroup, Option } = Select;

export const EXPAND_FIELD = "expand-by";
export const EXPAND_ITEMS = "expand-items";
const SELECT_ALL = "select-all";

export type ExpandFormFields = {
  [EXPAND_FIELD]: string;
  [SELECT_ALL]: boolean;
  [EXPAND_ITEMS]: string[];
};

const ExpandForm: FC<{
  setExpandColumns: Dispatch<SetStateAction<ExpandColumn[]>>;
  selectedLevel?: number;
  preselection?: ExpandColumn;
}> = ({ setExpandColumns, selectedLevel, preselection }) => {
  const { discoveryData } = useContext(InitDataContext);
  const [expandForm] = useForm<ExpandFormFields>();
  const [fieldStore, setFieldStore] = useState<string>("");

  const expandColumn = useWatch(EXPAND_FIELD, expandForm);
  const selectedExpandItems = useWatch(EXPAND_ITEMS, expandForm);

  const columnToExpand = useMemo(
    () =>
      preselection !== undefined
        ? [{ values: [preselection.column], store: preselection.store }]
        : [{ values: [expandColumn], store: fieldStore }],
    [
      expandColumn,
      fieldStore,
      preselection,
      preselection?.store,
      preselection?.column,
    ]
  );

  const { isLoadingFilters, filtersByColumn } =
    useFiltersFromColumns(columnToExpand);

  const allExpandItems = _flatten(
    Array.from(filtersByColumn).map(([, value]) =>
      getSelectOptionsFromSet(value)
    )
  );

  const submitForm = useCallback(
    (allFields: { [EXPAND_FIELD]: string; [EXPAND_ITEMS]: string[] }) => {
      setExpandColumns((prevColumns) => {
        const prevColumnsFromSelectedLevel = selectedLevel
          ? prevColumns.filter(
              (prevColumn) => prevColumn.position <= selectedLevel
            )
          : prevColumns;

        const filteredPrevColumns = prevColumnsFromSelectedLevel.filter(
          (prevColumn) =>
            prevColumn.store !== (preselection?.store || fieldStore) ||
            prevColumn.column !==
              (preselection?.column || allFields[EXPAND_FIELD])
        );

        return [
          ...filteredPrevColumns,
          {
            position: filteredPrevColumns.length,
            column: allFields[EXPAND_FIELD],
            fields: allFields[EXPAND_ITEMS].map(parseNull),
            store: fieldStore,
          },
        ];
      });

      expandForm.resetFields();
    },
    [expandForm, fieldStore, preselection?.store, preselection?.column]
  );

  const selectItems = useCallback(
    (list: CheckboxValueType[]) => {
      expandForm.setFieldsValue({
        [SELECT_ALL]: list.length === allExpandItems.length,
        [EXPAND_ITEMS]: list,
      });
    },
    [expandForm, allExpandItems?.length]
  );

  useEffect(() => {
    if (preselection !== undefined) {
      selectItems(preselection.fields.map(stringifyNull));
    }
  }, [preselection?.column, preselection?.store]);

  useEffect(() => {
    if (
      selectedExpandItems !== undefined &&
      allExpandItems?.length === selectedExpandItems.length
    ) {
      expandForm.setFieldValue(SELECT_ALL, true);
    }
  }, [selectedExpandItems?.length, allExpandItems?.length]);

  return (
    <Form
      colon={false}
      form={expandForm}
      style={{ width: 250 }}
      onFinish={submitForm}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={
        preselection !== undefined
          ? {
              [EXPAND_FIELD]: preselection.column,
              [SELECT_ALL]:
                preselection.fields.length === allExpandItems?.length,
              [EXPAND_ITEMS]: preselection.fields,
            }
          : undefined
      }
    >
      {preselection === undefined && (
        <Item label="Expand by" name={EXPAND_FIELD}>
          <Select
            showSearch
            filterOption
            size="small"
            onChange={(_value: string, option) => {
              if (!_isArray(option)) {
                setFieldStore(option.store);
              }
            }}
          >
            {discoveryData.stores.map((store) => (
              <OptGroup key={store.name} label={store.name}>
                {store.fields.map((field) => (
                  <Option
                    key={store.name + field.name}
                    label={field.name}
                    value={field.name}
                    store={store.name}
                  >
                    {field.name}
                  </Option>
                ))}
              </OptGroup>
            ))}
          </Select>
        </Item>
      )}
      <Loading isLoading={isLoadingFilters}>
        {allExpandItems.length > 0 && (
          <>
            <Item
              label="Select items"
              name={SELECT_ALL}
              valuePropName="checked"
            >
              <Checkbox
                indeterminate={
                  selectedExpandItems?.length !== 0 &&
                  selectedExpandItems?.length < allExpandItems.length
                }
                onChange={(e: CheckboxChangeEvent) => {
                  selectItems(
                    e.target.checked
                      ? allExpandItems.map((expand) => expand.value)
                      : []
                  );
                }}
                style={{
                  height: 32,
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                (All)
              </Checkbox>
            </Item>
            <Item label=" " name={EXPAND_ITEMS}>
              <Checkbox.Group
                style={{
                  display: "grid",
                  gridAutoFlow: "row",
                  maxHeight: 160,
                  width: "100%",
                  overflowY: "auto",
                }}
                options={allExpandItems}
                onChange={selectItems}
              />
            </Item>
          </>
        )}
      </Loading>
      <Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={
            isLoadingFilters ||
            selectedExpandItems === undefined ||
            selectedExpandItems.length === 0
          }
        >
          Expand
        </Button>
      </Item>
    </Form>
  );
};

export default ExpandForm;
