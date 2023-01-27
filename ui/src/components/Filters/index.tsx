import React, { FC, useContext, useState } from "react";

import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _omitBy from "lodash/omitBy";

import FilterOutlined from "@ant-design/icons/lib/icons/FilterOutlined";
import Button from "antd/lib/button";
import Checkbox from "antd/lib/checkbox";
import Collapse from "antd/lib/collapse";
import Form from "antd/lib/form";
import Spin from "antd/lib/spin";

import { filters as configFilters } from "../../config";
import FiltersContext from "../../contexts/FiltersContext";
import Title from "../Title";
import "./style.css";
import { FormattedMetaData } from "../../network/types";
import { Badge } from "antd";
import { FieldData } from "rc-field-form/lib/interface";
import { useFiltersFromColumns } from "../../hooks";

const { Panel } = Collapse;
const { Item } = Form;

const Filters: FC<{
  availableFilters: FormattedMetaData["filters"];
}> = ({ availableFilters }) => {
  const [form] = Form.useForm();
  const { selectedFilters, setSelectedFilters } = useContext(FiltersContext);
  const [selectedFilterCount, setSelectedFilterCount] = useState<
    Record<string, number>
  >({});
  const { isLoadingFilters, filtersByColumn } =
    useFiltersFromColumns(availableFilters);

  const submitForm = async (allFields: Record<string, string[]>) => {
    const newSelection = _omitBy(
      allFields,
      (item) => _isNil(item) || _isEmpty(item)
    );

    setSelectedFilters(newSelection);
  };

  const onChange = (_changedFields: FieldData[], allFields: FieldData[]) => {
    const countByFilterGroup = allFields.reduce(
      (acc, field) => ({ ...acc, [field.name as string]: field.value?.length }),
      {}
    );
    setSelectedFilterCount(countByFilterGroup);
  };

  return (
    <div className="filters-component">
      <Title>Filters</Title>
      {isLoadingFilters ? (
        <Spin />
      ) : (
        <Form
          name="filtersForm"
          onFinish={submitForm}
          form={form}
          layout="vertical"
          initialValues={selectedFilters}
          onFieldsChange={onChange}
        >
          <Collapse ghost>
            {Array.from(filtersByColumn).map(([filterName, filterValues]) => (
              <Panel
                key={filterName}
                header={
                  <Badge
                    color="green"
                    count={selectedFilterCount[filterName] || 0}
                    size="small"
                    offset={[10, 0]}
                  >
                    <b>
                      {configFilters.find((filter) => filter.id === filterName)
                        ?.alias || filterName}
                    </b>
                  </Badge>
                }
              >
                <Item name={filterName}>
                  <Checkbox.Group>
                    {Array.from(filterValues).map((filterValue) => (
                      <Checkbox
                        key={filterName + String(filterValue)}
                        value={filterValue}
                      >
                        <span title={String(filterValue)}>
                          {String(filterValue)}
                        </span>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Item>
              </Panel>
            ))}
          </Collapse>
          <div className="filters-actions">
            <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
              Filter
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default Filters;
