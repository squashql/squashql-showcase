import { presetPrimaryColors, grey, green } from "@ant-design/colors";
import _pick from "lodash/pick";
import { IconInterface } from "../../types";

export const palette = Object.values(
  _pick(presetPrimaryColors, [
    "blue",
    "magenta",
    "gold",
    "cyan",
    "volcano",
    "lime",
  ])
);

export const getIcon = (value: number): IconInterface => {
  if (value < 0) {
    return { iconColor: presetPrimaryColors.volcano, iconShape: "▼" };
  } else if (value > 0) {
    return { iconColor: green.primary as string, iconShape: "▲" };
  } else {
    return { iconColor: grey[7], iconShape: "➝" };
  }
};

export const getColor = (columnIndex: number) =>
  palette[columnIndex % palette.length];

export const truncateLongText = (text: string) =>
  text.length <= 26 ? text : `${text.substring(0, 22)}...`;
