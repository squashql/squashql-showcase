import { blue, purple, grey } from "@ant-design/colors";
import { WaterfallConfig } from "@ant-design/plots/es/components/waterfall";
import { ColumnConfig } from "@ant-design/plots/lib/components/column";

import { SCENARIO_COLUMN } from "../../config";
import { formatChartNumber } from "../../dataFormatting";
import { FormattingData } from "../../types";

const axesStyle = {
  label: {
    style: {
      fontSize: 10,
    },
  },
};

const getCommonConfig = (
  measure: string,
  measuresSettings: Record<string, FormattingData>
) => {
  return {
    height: 180,
    xField: SCENARIO_COLUMN,
    yField: "result",
    label: {
      style: {
        fontSize: 10,
        fill: "#fff",
      },
      layout: [
        {
          type: "interval-adjust-position",
        },
      ],
    },
    xAxis: axesStyle,
    yAxis: axesStyle,
    meta: {
      result: {
        alias: measure,
        formatter: (value: number | null) =>
          formatChartNumber(value || 0, measuresSettings[measure]),
      },
    },
  };
};

const getColumnChartConfig = (
  measure: string,
  measuresSettings: Record<string, FormattingData>
): Omit<ColumnConfig, "data"> => ({
  ...getCommonConfig(measure, measuresSettings),
  seriesField: "result",
  color: ({ result }) => {
    if (result < 0) {
      return purple.primary as string;
    } else if (result > 0) {
      return blue.primary as string;
    }
    return grey.primary as string;
  },
  legend: false,
});

const getWaterfallConfig = (
  measure: string,
  measuresSettings: Record<string, FormattingData>
): Omit<WaterfallConfig, "data"> => ({
  ...getCommonConfig(measure, measuresSettings),
  risingFill: blue.primary,
  fallingFill: purple.primary,
  appendPadding: [15, 0, 0, 0],
  total: {
    style: {
      fill: grey.primary,
    },
  },
});

export { getColumnChartConfig, getWaterfallConfig };
