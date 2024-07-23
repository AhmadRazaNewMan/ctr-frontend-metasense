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
        <Link to={webRoutes.uploadDocumentUnstructured}>
          Upload Document UnStructured
        </Link>
      ),
    },
  ],
};

export default function UploadDocumentLlama() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Steps current={currentStep} direction="vertical">
        <Step
          title={
            <span className="block font-bold font-poppins">
              Upload Document UnStructured
            </span>
          }
          description={
            <span className="block font-medium font-lato">
              This API endpoint facilitates the upload of PDF documents for
              further processing. Upon uploading a PDF document, the API
              extracts text and tables from the document, stores the embedded
              content, and detects the language of the text using Supabase.
            </span>
          }
          onClick={() => setCurrentStep(0)}
        />
        <Step
          title={
            <span className="block font-bold font-poppins">
              Store Structured Data
            </span>
          }
          description={
            <span className="block font-medium font-lato">
              This API endpoint serves the purpose of storing structured data
              obtained from various sources. It retrieves a title from the
              request body, obtains embedding data from Pinecone, retrieves text
              from Pinecone using nearest finding, generates a base prompt for
              GPT-4, and finally stores the result in Supabase for further
              processing or analysis.
            </span>
          }
          onClick={() => setCurrentStep(1)}
        />
      </Steps>
      {currentStep === 0 && <UploadDoc nextStep={nextStep} />}
      {currentStep === 1 && <StoreDoc prevStep={prevStep} />}
    </BasePageContainer>
  );
}
