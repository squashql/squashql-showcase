import { MetadataResult, StoreMetadata } from "@squashql/squashql-js";

import { PERIODS, filters as configFilters } from "../config";
import { FormattedMetaData, NumberFields } from "../network/types";

export const formatDiscoveryData = (
  discoveryData: MetadataResult
): FormattedMetaData => {
  const aggregations = discoveryData.aggregationFunctions || [];

  const filters = discoveryData.stores
    .map((store) => {
      const filtersFields = store.fields.filter(
        // TODO: include other types. exclude scenario?
        (field) => configFilters.find(({ id }) => id === field.name)
      );

      if (filtersFields?.length > 0) {
        const filterNames = filtersFields.map((filter) => filter.name);

        return { store: store.name, values: filterNames };
      }
    })
    .filter((item) => item !== undefined) as FormattedMetaData["filters"];

  const { numbers, fields } = discoveryData.stores.reduce(
    (
      accumulator: { numbers: NumberFields[]; fields: any[] },
      store: StoreMetadata
    ): { numbers: NumberFields[]; fields: any[] } => {
      const numberFields: NumberFields[] = [];
      const stringFields: any[] = [];

      store.fields.forEach((field) => {
        if (field.type === "java.lang.String") {
          stringFields.push(field);
        } else if (
          field.type === "int" ||
          field.type === "double" ||
          field.type === "long"
        ) {
          numberFields.push(field as NumberFields);
        }
      });

      if (numberFields.length !== 0) {
        accumulator.numbers.push(...numberFields);
      }
      if (stringFields.length !== 0) {
        accumulator.fields.push(...stringFields);
      }
      return accumulator;
    },
    { numbers: [], fields: [] }
  );

  const numbersExceptPeriods =
    numbers.filter((number) =>
      PERIODS !== null ? !PERIODS.includes(number.name) : undefined
    ) || [];

  const periods =
    numbers.filter((number) =>
      PERIODS !== null ? PERIODS.includes(number.name) : undefined
    ) || [];

  return {
    aggregations,
    filters,
    fields,
    measures: discoveryData.measures,
    numbers: numbersExceptPeriods,
    periods,
    stores: discoveryData.stores,
  };
};
