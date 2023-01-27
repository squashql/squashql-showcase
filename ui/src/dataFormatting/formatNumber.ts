import { CURRENCY_SYMBOL } from "../config";
import { NumberFormat } from "../types";

const getNumberWithSuffix = (number: number, decimals: number): string => {
  if (decimals >= 0) {
    return String(number);
  } else {
    let shift, suffix;

    if (decimals >= -3) {
      shift = -3;
      suffix = "\xA0k";
    } else if (decimals >= -6) {
      shift = -6;
      suffix = "\xA0M";
    } else {
      shift = -9;
      suffix = "\xA0G";
    }

    const shiftedNumber = number * 10 ** shift;
    const truncateLength = decimals % 3 === 0 ? 0 : 3 + (decimals % 3);
    const truncatedNumber = shiftedNumber.toLocaleString("fr-FR", {
      maximumFractionDigits: truncateLength,
      minimumFractionDigits: truncateLength,
    });

    return truncatedNumber + suffix;
  }
};

export const roundNumber = (number: number, decimals: number): string => {
  const factor = 10 ** decimals;
  const roundedNumber = Math.round(number * factor) / factor;
  // Fix potential rounding failure.
  const numberString = roundedNumber.toLocaleString("fr-FR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return numberString;
};

const formatSymbol: Record<NumberFormat, string> = {
  percent: "%",
  none: "",
  currency: CURRENCY_SYMBOL,
};

const formatNumber = (
  number: number,
  format: NumberFormat,
  decimals: number
): string => {
  const newNumber = format === "percent" ? number * 100 : number;

  let formattedNumber =
    decimals < 0
      ? getNumberWithSuffix(newNumber, decimals)
      : roundNumber(newNumber, decimals);

  formattedNumber += format === "none" ? "" : "\xA0" + formatSymbol[format];
  formattedNumber = formattedNumber
    .replace(`k\xA0`, `k`)
    .replace(`M\xA0`, `M`)
    .replace(`G\xA0`, `G`);

  return formattedNumber;
};

export const formatChartNumber = (
  number: number | null,
  measureSettings?: { format: NumberFormat; chartRounding: number }
): string => {
  if (number === null) {
    return "";
  }

  if (measureSettings === undefined) {
    return String(number);
  }
  const { format = "none" } = measureSettings;
  const decimals = measureSettings.chartRounding || 0;

  return formatNumber(number, format, decimals);
};

export const formatTableNumber = (
  number: number,
  measureSettings?: { format: NumberFormat; tableRounding: number }
): string => {
  if (measureSettings === undefined) {
    return String(number);
  }
  const { format = "none" } = measureSettings;
  const decimals = measureSettings.tableRounding || 0;

  return formatNumber(number, format, decimals);
};
