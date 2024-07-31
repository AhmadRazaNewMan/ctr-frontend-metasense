import React from "react";

// Components
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <a href={webRoutes.dashboard}>Dashboard</a>,
    },
    {
      key: webRoutes.reports,
      title: <a href={webRoutes.reports}>Reports</a>,
    },
  ],
};

export default function Settings() {


  return (
    <BasePageContainer breadcrumb={breadcrumb}>
    
 
    </BasePageContainer>
  );
}

