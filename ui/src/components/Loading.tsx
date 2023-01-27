import React, { FC } from "react";
import Spin from "antd/lib/spin";

const Loading: FC<{ isLoading: boolean }> = ({ isLoading, children }) =>
  isLoading ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin />
    </div>
  ) : (
    <>{children}</>
  );

export default Loading;
