import React, { Dispatch, FC, Fragment, SetStateAction, useMemo } from "react";
import { blue, grey } from "@ant-design/colors";
import FilterOutlined from "@ant-design/icons/FilterOutlined";
import Button from "antd/lib/button";
import _sortBy from "lodash/sortBy";

import { useFiltersFromColumns } from "../../hooks";
import { FilterStoreAndValues } from "../../network/types";
import { Loading } from "..";
import ExpandPopover from "./ExpandPopover";
import { ExpandColumn } from "./types";

const ExpandColumnHeader: FC<{
  expandColumns: ExpandColumn[];
  setExpandColumns: Dispatch<SetStateAction<ExpandColumn[]>>;
}> = ({ expandColumns, setExpandColumns }) => {
  const expandValuesByStore = useMemo(
    () =>
      expandColumns.reduce((acc: FilterStoreAndValues[], expand) => {
        const existingEntry = acc.find((e) => e.store === expand.store);

        return [
          ...acc.filter((e) => e.store !== expand.store),
          {
            store: expand.store,
            values:
              existingEntry !== undefined
                ? [...existingEntry.values, expand.column]
                : [expand.column],
          },
        ];
      }, []),
    [expandColumns]
  );

  const { isLoadingFilters, filtersByColumn } =
    useFiltersFromColumns(expandValuesByStore);

  return (
    <Loading isLoading={isLoadingFilters}>
      {_sortBy(expandColumns, "position").map((level, index) => (
        <Fragment key={level.column}>
          <Button
            size="small"
            type="link"
            onClick={() =>
              setExpandColumns((prev) =>
                level.position === -1
                  ? []
                  : prev.filter((expand) => expand.position <= level.position)
              )
            }
          >
            <b>{level.column}</b>
          </Button>
          {index !== 0 && (
            <div style={{ display: "inline-block" }}>
              <ExpandPopover
                isEnabled={true}
                setExpandColumns={setExpandColumns}
                preselection={level}
              >
                <FilterOutlined
                  style={{
                    color:
                      filtersByColumn.get(level.column)?.size ===
                      level.fields.length
                        ? grey[0]
                        : blue[5],
                    cursor: "pointer",
                  }}
                />
              </ExpandPopover>
            </div>
          )}
          {index !== expandColumns.length - 1 && " / "}
        </Fragment>
      ))}
    </Loading>
  );
};

export default ExpandColumnHeader;
