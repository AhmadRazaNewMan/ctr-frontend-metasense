import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Steps } from "antd";
import Prism from "prismjs";

//Components
import UploadDoc from "./UploadDoc";
import StoreDoc from "./StoreDoc";
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";
import "prismjs/themes/prism-okaidia.css";

const { Step } = Steps;
const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.uploadDocument,
      title: (
        <Link to={webRoutes.uploadDocumentLlama}>Upload Document Llama</Link>
      ),
    },
  ],
};

export default function UploadDocumentLlama() {


  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
    
       <UploadDoc />
     
    </BasePageContainer>
  );
}
