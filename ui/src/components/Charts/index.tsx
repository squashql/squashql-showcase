import React, { FC, useContext } from "react";
import ColumnChart from "@ant-design/plots/lib/components/column";
import Waterfall from "@ant-design/plots/lib/components/waterfall";
import Divider from "antd/lib/divider";
import Card from "antd/lib/card";
import Title from "antd/lib/typography/Title";

import { getColumnChartConfig, getWaterfallConfig } from "./chartsConfig";
import SelectionContext from "../../contexts/SelectionContext";
import { isComparisonWithPrevious } from "./utils";
import { formatChartData } from "../../dataFormatting";
import { PeriodField } from "../../types";
import { FetchedData } from "../../network/types";
import LocalStorageContext from "../../contexts/LocalStorageContext";
import PeriodContext from "../../contexts/PeriodContext";

const { Grid } = Card;

const Charts: FC<{
  data?: FetchedData;
}> = ({ data }) => {
  const { selectedMeasures } = useContext(SelectionContext);
  const { selectedPeriod } = useContext(PeriodContext);
  const { measuresSettings } = useContext(LocalStorageContext);

  if (data === undefined || Number(data.table?.columns?.length) === 0) {
    return <div>No data.</div>;
  }

  const chartData = formatChartData(
    data,
    selectedPeriod as Required<PeriodField>
  );

  return (
    <div>
      {Object.entries(chartData).map(
        ([metricName, dataByMetric], metricsIndex) => (
          <div key={metricsIndex}>
            <Divider orientation="left" orientationMargin="0">
              Comparing {metricName} results
            </Divider>
            <Card>
              {Object.entries(dataByMetric).map(
                ([group, results], groupIndex) => (
                  <Grid
                    hoverable={false}
                    style={{ width: "33.3%" }}
                    key={`${metricsIndex}-${groupIndex}`}
                  >
                    <Title level={5}>{group}</Title>

                    {isComparisonWithPrevious(metricName, selectedMeasures) ? (
                      <Waterfall
                        {...getWaterfallConfig(metricName, measuresSettings)}
                        data={results}
                      />
                    ) : (
                      <ColumnChart
                        {...getColumnChartConfig(metricName, measuresSettings)}
                        data={results}
                      />
                    )}
                  </Grid>
                )
              )}
            </Card>
          </div>
        )
      )}
    </div>
  );
};

export default Charts;
