import { filters as filtersConfig, type Filter } from "../../config";

export const mergeMaps = (maps: (Map<any, any> | undefined)[]) => {
  const mergedMaps = new Map();

  maps.forEach((map) =>
    map?.forEach((mapValue, mapKey) => {
      if (mapValue) {
        mergedMaps.set(mapKey, mapValue);
      }
    })
  );

  return mergedMaps;
};

const filtersSorting = filtersConfig.reduce(
  (allFilters: Record<string, number>, filter: Filter, index: number) => ({
    ...allFilters,
    [filter.id]: index,
  }),
  {}
);

const sortItems = (aFilter: string, bFilter: string) =>
  filtersSorting[aFilter] - filtersSorting[bFilter];

export const sortItemsMap = (map: Map<any, any>) =>
  new Map([...map].sort(([aKey], [bKey]) => sortItems(aKey, bKey)));
