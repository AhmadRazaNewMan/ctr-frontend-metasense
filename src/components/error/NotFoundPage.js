import React from "react";
import { Result } from "antd";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    </div>
  );
}
