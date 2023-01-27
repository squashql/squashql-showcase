import React, { FC, Fragment } from "react";
import { NodeConfig } from "@ant-design/graphs";
import { black, grey } from "./config";
import { TreeGraphMeasureInfo } from "../../types";

const margin = 6;
const fontSize = 11;
const squareSize = 4;

const TootlipItem: FC<{ item: TreeGraphMeasureInfo }> = ({ item }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      marginBottom: squareSize,
    }}
  >
    <div
      style={{
        width: squareSize,
        height: squareSize,
        backgroundColor: item.legendColor,
        margin: `${margin}px ${margin}px 0 0`,
      }}
    ></div>
    <div>
      <span style={{ color: grey }}>{item.text}</span>
      <br />
      {item.expression}
    </div>
  </div>
);

interface TreeTooltipProps {
  node?: NodeConfig;
}

const TreeTooltip: FC<TreeTooltipProps> = ({ node }) => (
  <div style={{ color: black, fontSize }}>
    {node?.value?.items.map((item: TreeGraphMeasureInfo) => (
      <Fragment key={item.text + item.expression}>
        <TootlipItem item={item} />
        {item.comparedMeasure !== undefined && (
          <TootlipItem item={item.comparedMeasure} />
        )}
      </Fragment>
    ))}
  </div>
);

export default TreeTooltip;
