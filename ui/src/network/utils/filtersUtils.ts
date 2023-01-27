import { HasCondition, _in, from, criterion, all } from "@squashql/squashql-js";

type CreateQueryWithFilters = (args: {
  selectedFilters?: Record<string, string[]>;
  tableToFilter: string;
}) => HasCondition;

export const createQueryWithFilters: CreateQueryWithFilters = ({
  selectedFilters = {},
  tableToFilter,
}) => {
  const criteria = Object.entries(selectedFilters).map(
    ([filterKey, filterValues]) => criterion(filterKey, _in(filterValues))
  );

  const query = from(tableToFilter).where(all(criteria));

  return query;
};
