import React, { Dispatch, FC, SetStateAction } from "react";

import { FormInstance } from "antd/lib/form";

import { PeriodField } from "../types";

interface PeriodContextInterface {
  setSelectedPeriod: Dispatch<
    SetStateAction<Required<PeriodField> | undefined>
  >;
  selectedPeriod?: Required<PeriodField>;
  periodForm?: FormInstance<any>;
}
const initialPeriodContextValues = {
  setSelectedPeriod: () => {},
};

const PeriodContext = React.createContext<PeriodContextInterface>(
  initialPeriodContextValues
);

export const PeriodContextProvider: FC<{
  value: PeriodContextInterface | null;
}> = ({ value, children }) => {
  return value !== null ? (
    <PeriodContext.Provider value={value}>{children} </PeriodContext.Provider>
  ) : (
    <>{children}</>
  );
};

export default PeriodContext;
