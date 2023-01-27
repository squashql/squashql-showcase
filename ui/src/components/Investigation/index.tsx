import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AimOutlined } from "@ant-design/icons";
import Button from "antd/lib/button";
import { BaseButtonProps } from "antd/lib/button/button";
import Form from "antd/lib/form";
import Table, { ColumnType } from "antd/lib/table";
import _isEmpty from "lodash/isEmpty";

import { Loading } from "..";
import {
  FiltersContext,
  PeriodContext,
  SelectionContext,
  LocalStorageContext,
  InitDataContext,
} from "../../contexts";
import { FetchedData } from "../../network/types";
import { fetchSimulationResults } from "../../network";
import { PERIODS } from "../../config";
import {
  getInvestigationTableColumns,
  getInvestigationTableDataFromFetchedData,
  hasResults,
} from "./utils";
import ExpandPopover from "./ExpandPopover";
import { ExpandColumn } from "./types";
import { InvestigationTableData, TableData } from "../Report/types";

const { useForm } = Form;

type Data = {
  columns: ColumnType<Record<string, unknown>>[];
  tableData: (TableData | InvestigationTableData)[];
};

const Investigation: FC<{
  data: {
    groupId: string;
    initData?: FetchedData;
  };
  setIsInvestigating: Dispatch<SetStateAction<boolean>>;
  isInvestigating: boolean;
}> = ({ data: { groupId, initData }, isInvestigating, setIsInvestigating }) => {
  const { selectedPeriod } = useContext(PeriodContext);
  const { groups, selectedMeasures } = useContext(SelectionContext);
  const { selectedFilters } = useContext(FiltersContext);
  const { measuresSettings } = useContext(LocalStorageContext);
  const { discoveryData } = useContext(InitDataContext);

  const [expandColumns, setExpandColumns] = useState<ExpandColumn[]>([]);
  const [isLoadingSimulationResults, setLoadingSimulationResults] =
    useState<boolean>(false);
  const [fetchedData, setFetchedData] = useState<FetchedData | undefined>(
    initData
  );
  const [formattedData, setFormattedData] = useState<Data>();

  const resetData = useCallback(() => {
    if (initData !== undefined) {
      setFetchedData(initData);
    }
  }, []);

  useEffect(() => {
    const getSimulationResults = async () => {
      setLoadingSimulationResults(true);

      try {
        const fetchedSimulationResults = await fetchSimulationResults(
          { [groupId]: groups[groupId] },
          selectedMeasures,
          {
            selectedFilters,
            expandColumns,
          }
        );

        if (hasResults(fetchedSimulationResults)) {
          setFetchedData(fetchedSimulationResults);
        }
      } finally {
        setLoadingSimulationResults(false);
      }
    };

    if (
      (selectedPeriod?.field !== undefined &&
        selectedPeriod?.value !== undefined) ||
      PERIODS === null
    ) {
      if (_isEmpty(groups)) {
        setFormattedData(undefined);
      } else if (expandColumns.length === 0) {
        resetData();
      } else {
        getSimulationResults();
      }
    }
  }, [
    groups,
    selectedPeriod,
    discoveryData,
    selectedMeasures,
    expandColumns,
    selectedFilters,
  ]);

  useEffect(() => {
    if (fetchedData !== undefined) {
      const tableData = getInvestigationTableDataFromFetchedData(
        fetchedData,
        measuresSettings,
        groupId,
        expandColumns
      );

      const columns = getInvestigationTableColumns(
        fetchedData,
        expandColumns,
        setExpandColumns,
        (props: { selectedLevel: number }) => (
          <ExpandPopover
            {...props}
            isEnabled={isInvestigating}
            setExpandColumns={setExpandColumns}
          />
        )
      );

      setFormattedData({ columns, tableData });
    }
  }, [fetchedData, isInvestigating]);

  const buttonProps = {
    icon: <AimOutlined />,
    size: "small" as BaseButtonProps["size"],
    style: { margin: "10px 0 20px 0" },
  };

  return (
    <Loading isLoading={isLoadingSimulationResults}>
      {isInvestigating === true ? (
        <Button
          {...buttonProps}
          type="primary"
          onClick={() => {
            setIsInvestigating(false);
          }}
        >
          Stop Investigation
        </Button>
      ) : (
        <Button
          {...buttonProps}
          type="link"
          onClick={() => {
            setIsInvestigating(true);
          }}
        >
          Start investigation...
        </Button>
      )}

      {formattedData === undefined ? (
        <div>No Data.</div>
      ) : (
        <Table
          {...(_isEmpty(expandColumns) ? {} : { defaultExpandAllRows: true })}
          bordered
          size="small"
          dataSource={formattedData.tableData}
          columns={formattedData.columns}
          pagination={false}
          className={isInvestigating ? "investigation-table" : ""}
        />
      )}
    </Loading>
  );
};

export default Investigation;
