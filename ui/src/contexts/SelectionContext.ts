import { Measure } from "@squashql/squashql-js";
import { createContext, Dispatch, SetStateAction } from "react";
import { Groups } from "../types";

interface SelectionContextInterface {
  groups: Groups;
  selectedMeasures: Measure[];
  setGroups: Dispatch<SetStateAction<Groups>>;
  setSelectedMeasures: Dispatch<SetStateAction<Measure[]>>;
}
const initialSelectionContextValues = {
  selectedMeasures: [],
  groups: {},
  setGroups: () => {},
  setSelectedMeasures: () => {},
};

const SelectionContext = createContext<SelectionContextInterface>(
  initialSelectionContextValues
);

export default SelectionContext;
