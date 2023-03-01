import React, { FC, useContext } from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import _groupBy from "lodash/groupBy";
import styles from "./styles";
import { getIndex } from "../utils";
import { FetchedData } from "../../network/types";
import { GROUP_COLUMN } from "../../config";
import { formatTableNumber } from "../../dataFormatting";
import LocalStorageContext from "../../contexts/LocalStorageContext";

interface PDFReportProps {
  data: FetchedData;
}

const PDFReport: FC<PDFReportProps> = ({ data }) => {
  const { measuresSettings } = useContext(LocalStorageContext);
  const {
    table: { columns, rows },
  } = data;
  const groupIndex = getIndex(columns, GROUP_COLUMN);
  const headerRow = columns
    .filter((column) => column !== GROUP_COLUMN)
    .map((column) => ({ value: column }));

  const dataByGroup = _groupBy(rows, (row) => row[groupIndex]);

  const tablesByGroup = Object.entries(dataByGroup).map(([groupId, table]) => ({
    group: groupId,
    table: [
      headerRow,
      ...table.map((row) =>
        row
          .map((cell, index) => ({
            value:
              typeof cell === "number"
                ? formatTableNumber(cell, measuresSettings[columns[index]])
                : cell,
          }))
          .filter((_cell, index) => index !== groupIndex)
      ),
    ],
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {tablesByGroup.map(({ table, group }, dataIndex) => (
          <View key={dataIndex}>
            <Text style={styles.title}>{group}</Text>
            <View key={dataIndex}>
              {table.map((row, rowIndex) => (
                <View
                  key={`${dataIndex}-${rowIndex}`}
                  style={
                    rowIndex === 0
                      ? { ...styles.row, ...styles.header }
                      : styles.row
                  }
                >
                  {row.map((cell, columnIndex) => (
                    <View
                      key={`${dataIndex}-${rowIndex}-${columnIndex}`}
                      style={styles.column}
                    >
                      <Text>{cell.value?.replaceAll(/\u202F/g, " ")}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PDFReport;
