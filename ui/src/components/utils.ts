import notification from "antd/lib/notification";
import { ElementDefinition } from "cytoscape";

export const getRootNodes = (elements: ElementDefinition[]) => {
  const edges = elements.filter((element) => element.data.source !== undefined);
  const nodes = elements.filter((element) => element.data.source === undefined);
  const targets = edges.map((edge) => edge.data.target);

  const rootNodes = nodes
    .map((node) => node.data.id)
    .filter((nodeId) => !targets.includes(nodeId));

  return rootNodes;
};

export const countTrees = (elements: ElementDefinition[]) => {
  const rootNodes = getRootNodes(elements);
  return rootNodes.length;
};

export const getIndex = (columns: string[], colName: string) =>
  columns.findIndex((column) => column === colName);

type NotificationType = "success" | "info" | "warning" | "error";

interface NotifyParam {
  type: NotificationType;
  message?: string;
  description?: string;
  duration?: number | null;
}

export const notify = ({
  type,
  message,
  description,
  duration,
}: NotifyParam) => {
  notification[type]({
    message,
    description,
    duration,
  });
};
