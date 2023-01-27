import _flatten from "lodash/flatten";
import { Measure } from "@squashql/squashql-js";
import { measureDescriptions } from "../config";

export const getIndex = (columns: string[], colName: string) =>
  columns.findIndex((column) => column === colName);

export const wrapLongText = (nbCharLimit: number, text: string): string => {
  if (text.length <= nbCharLimit) {
    return text;
  } else {
    let multilineText = "";
    let remainginChars = text;

    for (
      let nbOfRemainingChars = text.length;
      nbOfRemainingChars > nbCharLimit;
      nbOfRemainingChars -= nbCharLimit
    ) {
      multilineText += `${remainginChars.substring(0, nbCharLimit)}\n`;
      remainginChars = remainginChars.slice(nbCharLimit);
    }

    return multilineText + remainginChars;
  }
};

export const isBucketComparison = (measure?: Measure): boolean =>
  _flatten(
    measureDescriptions.map((description) => description.comparisonMeasures)
  ).some((comparisonMeasure) => measure?.alias === comparisonMeasure.alias);

export const stringifyNull = <T extends number | string>(
  stringToConvert: T | null
): T | string => (stringToConvert === null ? "(null)" : stringToConvert);

export const parseNull = <T extends number | string>(
  stringToConvert: T
): T | null => (stringToConvert === "(null)" ? null : stringToConvert);

export const getSelectOptionsFromArray = (
  array: (string | number)[]
): { label: string | number; value: string | number }[] =>
  array.map((item) => ({
    label: stringifyNull(item),
    value: stringifyNull(item),
  }));

export const getSelectOptionsFromSet = (
  set?: Set<string | number>
): { label: string | number; value: string | number }[] =>
  set === undefined ? [] : getSelectOptionsFromArray(Array.from(set));
