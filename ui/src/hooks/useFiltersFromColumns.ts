import { useEffect, useState } from "react";
import _isNil from "lodash/isNil";
import { mergeMaps, sortItemsMap } from "../components/Filters/utils";
import { FormattedMetaData, fetchAllFilters } from "../network";

type FiltersByColumn = Map<string, Set<string>>;

const useFiltersFromColumns = (columns: FormattedMetaData["filters"]) => {
  const [filtersByColumn, setFiltersByColumn] = useState<FiltersByColumn>(new Map());
  const [isLoadingFilters, setLoadingFilters] = useState<boolean>(false);

  const loadFilters = async (columnsToLoad: FormattedMetaData["filters"], isComponentMounted: boolean) => {
    try {
      setLoadingFilters(true);
      const fetchedFilters = await fetchAllFilters(columnsToLoad);

      if (fetchedFilters && isComponentMounted) {
        const mergedFilters: FiltersByColumn = mergeMaps(fetchedFilters);
        const sortedFilters: FiltersByColumn = sortItemsMap(mergedFilters);

        setFiltersByColumn(sortedFilters);
      }
    } finally {
      if (isComponentMounted) {
        setLoadingFilters(false);
      }
    }
  };

  useEffect(() => {
    let isComponentMounted = true;

    const noEmptyFilters = columns.filter((column) => column.values.filter((value) => !_isNil(value)).length > 0);

    if (noEmptyFilters.length !== 0) {
      loadFilters(columns, isComponentMounted);
    }

    return () => {
      isComponentMounted = false;
    };
  }, [columns]);

  return { isLoadingFilters, filtersByColumn };
};

export { useFiltersFromColumns };
