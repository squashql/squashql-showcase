import React, { Dispatch, FC, SetStateAction } from "react";
import Popover from "antd/lib/popover";

import ExpandForm from "./ExpandForm";
import { ExpandColumn } from "./types";

const ExpandPopover: FC<{
  setExpandColumns: Dispatch<SetStateAction<ExpandColumn[]>>;
  selectedLevel?: number;
  isEnabled: boolean;
  preselection?: ExpandColumn;
}> = ({ children, setExpandColumns, selectedLevel, isEnabled, preselection }) => (
  <Popover
    getPopupContainer={(node) => node.parentElement || node}
    content={
      isEnabled ? (
        <ExpandForm setExpandColumns={setExpandColumns} selectedLevel={selectedLevel} preselection={preselection} />
      ) : null
    }
    trigger="click"
    placement="bottom"
  >
    <div>{children}</div>
  </Popover>
);

export default ExpandPopover;
