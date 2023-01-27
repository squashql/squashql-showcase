import { createContext, Dispatch, SetStateAction } from "react";

export type SelectedFiltersType = Record<string, string[]>;

interface FiltersContextInterface {
  selectedFilters: SelectedFiltersType;
  setSelectedFilters: Dispatch<SetStateAction<SelectedFiltersType>>;
}
const initialFiltersContextValues = {
  selectedFilters: {},
  setSelectedFilters: () => {},
};

const FiltersContext = createContext<FiltersContextInterface>(
  initialFiltersContextValues
);

export default FiltersContext;
