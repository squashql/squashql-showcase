import React, {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DecompositionTreeGraph as TreeGraph,
  IG6GraphEvent,
} from "@ant-design/graphs";
import Alert from "antd/lib/alert";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _omit from "lodash/omit";

import { Groups } from "../../types";
import { getConfig } from "./config";
import { FetchedData } from "../../network/types";
import SelectionContext from "../../contexts/SelectionContext";
import { getGraphScenarii, rootScenarioNode } from "../../dataFormatting";
import LocalStorageContext from "../../contexts/LocalStorageContext";
import PeriodContext from "../../contexts/PeriodContext";
import FiltersContext from "../../contexts/FiltersContext";

const hasScenarioInAncestors = (
  scenarioName: string,
  scenarioPosition: number,
  group: string[]
): boolean => {
  const ancestors = group.slice(0, scenarioPosition + 1);

  return ancestors.some((scenario) => scenario === scenarioName);
};

interface TreeProps {
  simulationResults?: FetchedData;
  groups: Groups;
  setGroups: Dispatch<SetStateAction<Groups>>;
  draggedScenario?: string;
}

const ScenariiGroupingTree: FC<TreeProps> = ({
  simulationResults,
  groups,
  setGroups,
  draggedScenario,
}) => {
  const { selectedPeriod } = useContext(PeriodContext);
  const { selectedMeasures } = useContext(SelectionContext);
  const { selectedFilters } = useContext(FiltersContext);
  const { measuresSettings } = useContext(LocalStorageContext);
  const [scenarioReceivingDrop, setScenarioReceivingDrop] = useState<string>();
  const [size, setSize] = useState<{ width: number; height: number }>({
    // TODO: Fix me.
    width: 1200,
    height: 400,
  });

  const treeGraphData = _isEmpty(groups)
    ? rootScenarioNode
    : getGraphScenarii(
        simulationResults || {
          table: { columns: [], rows: [[]] },
          metadata: [],
        },
        selectedMeasures,
        groups,
        measuresSettings,
        { selectedPeriod, selectedFilterColumns: Object.keys(selectedFilters) }
      );

  const handleDrop = (event: IG6GraphEvent) => {
    const nodeReceivingDrop = event.target.cfg?.parent?.cfg?.id || "root";
    setScenarioReceivingDrop(nodeReceivingDrop);
  };

  const handleDelete = (event: IG6GraphEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const nodeToDelete = event.target.cfg?.parent?.cfg?.id;
    const groupId = nodeToDelete?.split("--")[0];

    if (groupId !== undefined && nodeToDelete !== undefined) {
      const groupToUpdate = groups[groupId];
      const newGroup = groupToUpdate.filter(
        (scenario) => !nodeToDelete.endsWith("--" + scenario)
      );

      const newParams =
        newGroup.length === 0
          ? _omit(groups, [groupId])
          : { ...groups, [groupId]: newGroup };

      setGroups(newParams);
    }
  };

  useEffect(() => {
    // TODO: Get groupId properly.
    const groupId = scenarioReceivingDrop?.split("--")[0];
    const newGroupIndex = _isEmpty(groups)
      ? 1
      : Math.max(
          ...Object.keys(groups).map((key) => Number(key.at(key.length - 1)))
        ) + 1;

    let newGroups = {};

    // If drop on root node...
    if (scenarioReceivingDrop === "root" && draggedScenario !== undefined) {
      newGroups = {
        ...groups,
        [`group${newGroupIndex}`]: [draggedScenario],
      };
      setGroups(newGroups);

      // If drop on any other node than root...
    } else if (
      groupId !== undefined &&
      scenarioReceivingDrop !== undefined &&
      draggedScenario !== undefined
    ) {
      const groupCopy = groups[groupId];
      const droppedPosition = groupCopy.findIndex(
        (item) => item === scenarioReceivingDrop
      );

      // TODO: Fix me.
      // If dropped scenario does not exist in ancestors...
      if (
        !hasScenarioInAncestors(draggedScenario, droppedPosition, groupCopy)
      ) {
        // If drop on last scenario of the group...
        if (
          scenarioReceivingDrop.endsWith("--" + groupCopy[groupCopy.length - 1])
        ) {
          newGroups = {
            ...groups,
            [groupId]: [...groupCopy, draggedScenario],
          };

          // If drop on other than last scenario of the group...
        } else {
          const newGroup = groupCopy.slice(
            0,
            groupCopy.findIndex((scenario) =>
              scenarioReceivingDrop.endsWith("--" + scenario)
            ) + 1
          );
          newGroup.push(draggedScenario);

          newGroups = {
            ...groups,
            [`group${newGroupIndex}`]: newGroup,
          };
        }
        setGroups(newGroups);
      }
    }
  }, [scenarioReceivingDrop, draggedScenario, setGroups]);

  const graphContainer = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphContainer.current) {
      const { width, height } = graphContainer.current.getBoundingClientRect();
      // TODO: Fix me.
      setSize({
        width: width === 0 ? 1200 : width,
        height: height === 0 ? 600 : height,
      });
    }
  }, [graphContainer.current]);

  return (
    <div className="on-boarding-and-graph">
      {Boolean(treeGraphData?.children?.length) === false && (
        <Alert
          className="on-boarding"
          message="Select measures then drag and drop scenarii to group them."
          type="info"
          showIcon
        />
      )}
      <div className="graph" ref={graphContainer}>
        {treeGraphData?.children?.length !== undefined && (
          <TreeGraph
            onReady={(graph) => {
              graph.on("drop", handleDrop);
              graph.on("node:contextmenu", handleDelete);
            }}
            data={treeGraphData}
            {...getConfig(
              _get(treeGraphData, "children.0.value.items.length" || 0)
            )}
            width={size.width}
            height={size.height}
            style={{
              fill: "#fff",
              width: size.width,
              height: size.height,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ScenariiGroupingTree;
