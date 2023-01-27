import { from, Querier } from "@squashql/squashql-js";
import { FormattedMetaData } from "./types";
import { ROOT_URL } from "../config";

export const fetchFiltersFormStore = async (
  store: string,
  filtersToFetch: string[]
) => {
  if (store !== "" && filtersToFetch.length > 0) {
    try {
      const querier = new Querier(ROOT_URL);
      const query = from(store).select(filtersToFetch, [], []).build();
      const data = await querier.execute(query);

      const filters: Record<string, Set<string>> = {};

      data.table.columns.forEach((column: string, index: number) =>
        Object.assign(filters, {
          [column]: new Set(data.table.rows.map((row) => row[index]).sort()),
        })
      );

      const sortedFiltersMap = new Map(
        Object.keys(filters)
          .sort()
          .map((key) => [key, filters[key]])
      );

      return Promise.resolve(sortedFiltersMap);
    } catch (error) {
      console.error(
        `Can't get filters: "${filtersToFetch.join(
          '", "'
        )}" from "${store}". ${error}`
      );
    }
  }
};

export const fetchAllFilters = async (
  filters: FormattedMetaData["filters"]
) => {
  const result = Promise.all(
    filters.map((filter) => fetchFiltersFormStore(filter.store, filter.values))
  );
  return Promise.resolve(result);
};
