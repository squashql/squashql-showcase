import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Table from "antd/lib/table";
import Button from "antd/lib/button";
import Divider from "antd/lib/divider";
import Alert from "antd/lib/alert";
import AimOutlined from "@ant-design/icons/AimOutlined";

import PDFReport from "./PDFReport";
import { getTableColumns, getTableDataByGroup } from "./utils";
import { FetchedData } from "../../network/types";
import LocalStorageContext from "../../contexts/LocalStorageContext";

interface ReportProps {
  data?: FetchedData;
  setInvestigatedGroupId: Dispatch<SetStateAction<string | undefined>>;
  setIsInvestigating: Dispatch<SetStateAction<boolean>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const Report: FC<ReportProps> = ({
  data,
  setInvestigatedGroupId,
  setIsInvestigating,
  setActiveTab,
}) => {
  const { measuresSettings } = useContext(LocalStorageContext);

  const tableDataByGroup = data
    ? getTableDataByGroup(data, measuresSettings)
    : {};
  const columns = data
    ? getTableColumns(data.table.columns, data.metadata)
    : [];
  const date = new Date(Date.now())
    .toLocaleString("en-GB", { hour12: false })
    .replaceAll("/", "-")
    .replace(",", "")
    .replace(":", "h")
    .replace(":", "m");

  const investigate = useCallback(
    (groupId: string) => {
      setIsInvestigating(true);
      setInvestigatedGroupId(groupId);
      setActiveTab("4");
    },
    [columns]
  );

  return data === undefined || data.table.columns.length === 0 ? (
    <p>No data.</p>
  ) : (
    <div className="report-tab-content">
      <div className="report-tab-content-main">
        {Object.entries(tableDataByGroup).map(([groupId, tableData]) => (
          <div key={groupId}>
            <Divider orientation="left" orientationMargin="0">
              {groupId}
              <Button
                icon={<AimOutlined />}
                type="link"
                onClick={() => {
                  investigate(groupId);
                }}
              >
                Start investigation...
              </Button>
            </Divider>
            <Table
              bordered
              size="small"
              dataSource={tableData}
              columns={columns}
              pagination={false}
            />
          </div>
        ))}
      </div>
      <div className="report-tab-content-bottom">
        <PDFDownloadLink
          document={<PDFReport data={data} />}
          fileName={`Scenarii Report - ${date}.pdf`}
        >
          {({ loading, error }) =>
            error ? (
              <Alert message={error.message} type="error" showIcon />
            ) : (
              <Button type="primary" loading={loading}>
                Export PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default Report;
