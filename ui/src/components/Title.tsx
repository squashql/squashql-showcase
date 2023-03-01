import { blue } from "@ant-design/colors";
import AntTitle, { TitleProps } from "antd/lib/typography/Title";
import React, { FC } from "react";

const Title: FC<TitleProps> = (props) => (
  <AntTitle {...props} level={5} style={{ ...props.style, color: blue[7] }} />
);

export default Title;
