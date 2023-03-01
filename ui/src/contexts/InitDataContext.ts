import { createContext } from "react";
import { FormattedMetaData } from "../network/types";

interface InitDataContextInterface {
  listData: string[];
  discoveryData: FormattedMetaData;
}
const initialContextValues = {
  listData: [],
  discoveryData: {
    aggregations: [],
    filters: [],
    fields: [],
    measures: [],
    numbers: [],
    periods: [],
    stores: [],
  },
};

const InitDataContext =
  createContext<InitDataContextInterface>(initialContextValues);

export default InitDataContext;
