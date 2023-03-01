import React from "react";
import { blue, grey as antGrey } from "@ant-design/colors";
import {
  CustomCfg,
  DecompositionTreeGraphConfig,
  IG6GraphEvent,
  IGroup,
  NodeConfig,
} from "@ant-design/graphs";
import { TreeGraphMeasureInfo } from "../../types";
import { truncateLongText } from "./utils";
import TreeTooltip from "./TreeTooltip";

const lightBlue = blue[1];
const veryLightBlue = blue[0];
export const grey = antGrey[2];
export const black = antGrey[7];

const margin = 8;
const fontSize = 12;
const lineHeight = 20;
const squareSize = 6;

export const getConfig = (
  itemsNb: number = 0
): Omit<DecompositionTreeGraphConfig, "data"> => ({
  nodeCfg: {
    size: [180, 40],
    style: {
      stroke: lightBlue,
      fill: "#fff",
    },
    nodeStateStyles: {
      hover: {
        lineWidth: 1,
        fill: "#fff",
        stroke: "transparent",
        shadowColor: blue.primary,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        offset: [5, 5],
      },
    },
    title: {
      autoEllipsis: false,
      containerStyle: {
        fill: veryLightBlue,
        stroke: lightBlue,
      },
      style: {
        fill: black,
      },
    },
    customContent: (
      node: TreeGraphMeasureInfo,
      group: IGroup | undefined,
      config: CustomCfg
    ) => {
      const {
        text,
        value,
        legendColor,
        iconShape,
        iconColor,
        isDifference,
        comparedMeasure,
      } = node;

      if (text === "root") {
        return 0;
      }

      const { startX = 0, startY = 0, width = 0 } = config;

      if (startX === 0) {
        const scenarioName = group?.cfg?.id;

        group!.addShape("text", {
          attrs: {
            x: startX + margin * 2,
            y: startY + margin,
            textBaseline: "top",
            fontSize,
            text: scenarioName,
            fill: black,
          },
          // TODO: Set proper unique name.
          name: `measure-${Math.random()}`,
        });
      }

      if (itemsNb !== 0) {
        if (text !== undefined) {
          const measureName = String(text);

          group!.addShape("rect", {
            attrs: {
              x: startX + margin,
              y: startY + margin + 2,
              width: squareSize,
              height: squareSize,
              fill: legendColor,
            },
            // TODO: Set proper unique name.
            name: `square-${Math.random()}`,
          });

          group!.addShape("text", {
            attrs: {
              x: startX + squareSize + margin * 2,
              y: startY + margin,
              textBaseline: "top",
              fontSize,
              // TODO: Check if id is necessary.
              // id: measureName,
              text: truncateLongText(measureName),
              fill: grey,
            },
            // TODO: Set proper unique name.
            name: `measure-${Math.random()}`,
          });

          if (isDifference) {
            group!.addShape("text", {
              attrs: {
                x: startX + squareSize + margin * 2,
                y: startY + margin + lineHeight,
                textBaseline: "top",
                fontSize,
                text: `${iconShape} ${value}`,
                fill: iconColor,
              },
              // TODO: Set proper unique name.
              name: `result-${Math.random()}`,
            });

            if (comparedMeasure !== undefined) {
              const textNode = group!.addShape("text", {
                attrs: {
                  x: startX,
                  y: startY + margin + lineHeight,
                  textBaseline: "top",
                  textAnchor: "end",
                  fontSize,
                  text: comparedMeasure.value,
                  fill: black,
                },
                // TODO: Set proper unique name.
                name: `result-${Math.random()}`,
              });
              textNode.attr(
                "x",
                startX + width - textNode.getBBox().width - margin
              );
            }
          } else {
            const textNode = group!.addShape("text", {
              attrs: {
                x: startX,
                y: startY + margin + lineHeight,
                textBaseline: "top",
                textAnchor: "end",
                fontSize,
                text: value,
                fill: black,
              },
              // TODO: Set proper unique name.
              name: `result-${Math.random()}`,
            });
            textNode.attr(
              "x",
              startX + width - textNode.getBBox().width - margin
            );
          }
        }
      }

      return (fontSize + margin) * 2;
    },
  },
  tooltipCfg: {
    itemTypes: ["node"],
    shouldBegin: (event?: IG6GraphEvent) => {
      const node = event?.target.cfg?.parent?.cfg;
      return (
        node !== undefined &&
        node.id !== "root" &&
        // TODO: Improve.
        // Check if node has measure(s) to display.
        node.children.length > 4
      );
    },
    // TODO: Get it calculated.
    offsetX: -380,
    offsetY: -30,
    customContent: (node) => <TreeTooltip node={node as NodeConfig} />,
  },
  edgeCfg: {
    endArrow: { fill: lightBlue },
    style: {
      stroke: lightBlue,
    },
    // Prevent from default styling.
    edgeStateStyles: {},
  },
  layout: {
    getWidth: () => 50,
    getHeight: () => (lineHeight + margin) * 2 * itemsNb + lineHeight,
  },
  behaviors: ["drag-canvas", "zoom-canvas"],
  animate: false,
  autoFit: false,
});
