import React from "react";
import { Result } from "antd";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong!"
      />
    </div>
  );
}
