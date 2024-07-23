import React, { useState, useEffect } from "react";
import { Button, Input, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

//Components
import {
  uploadDocument,
  checkJobStatus,
} from "../../redux/methods/documentMethods";

export default function UploadDoc() {
  const [file, setFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [jobStatusState, setJobStatusState] = useState(null);

  const dispatch = useDispatch();
  const { loading, response, jobStatus, errors } = useSelector(
    (state) => state.uploadDocumentReducer
  );

  //Display Errors
  useEffect(() => {
    if (errors.length > 0) {
      errors.map((err) => {
        if (err.response) {
          return toast.error(err.response.data.msg);
        } else {
          return toast.error(err.message);
        }
      });
    }
  }, [errors]);

  //Check Status
  useEffect(() => {
    dispatch(checkJobStatus());
  }, [dispatch]);

  //Set Job Status
  useEffect(() => {
    if (Object.keys(jobStatus).length !== 0) {
      setJobStatusState(jobStatus);
    }
  }, [jobStatus]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //Functions
  const handleUploadDocument = async () => {
    if (!file || !companyName) {
      toast.error("File and Company Name are required.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("company_name", companyName);

    await dispatch(uploadDocument(formData, "adobe"));

    await delay(2000);

    window.location.reload();
  };

  return (
    <div className="mt-5">
      <div className="flex justify-center items-center">
        <Upload.Dragger
          className="h-48 sm:h-52 md:h-56 lg:h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
          accept=".pdf"
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
        >
          <p className="font-bold font-lato">
            Drag PDF file here or click to upload.
          </p>
        </Upload.Dragger>
      </div>

      <div className="mt-5">
        <p className="block text-sm font-bold font-poppins text-gray-900">
          Company Name
        </p>
        <Input
          className="bg-gray-50 font-lato text-gray-900 sm:text-sm py-1.5 w-80"
          placeholder="Enter Company Name"
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          className="mt-4 bg-black"
          type="primary"
          size="large"
          loading={loading}
          onClick={handleUploadDocument}
          disabled={jobStatus.status === "processing"}
        >
          Execute
        </Button>
        <p className="pl-5 font-poppins font-medium text-md">
          {jobStatus.status === "processing" ? (
            <span className="text-red-500">
              System currently processing document JobId {jobStatus.jobId},
              please wait.
            </span>
          ) : (
            <span className="text-green-500">System Available</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="h-auto md:h-full">
          <p className="block text-sm font-bold font-poppins text-gray-900">
            Request
          </p>
          <pre className="h-auto md:h-full">
            <code className="language-javascript">
              {`
fetch('https://ctr-backend-metasense.vercel.app/api/document/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  file: [PDF file]
  company_name: "Document Title"
})
.then(response => response.json())
.then(data => console.log(data));
`}
            </code>
          </pre>
        </div>
        <div className="h-auto md:h-full">
          <p className="block text-sm font-bold font-poppins text-gray-900">
            Response
          </p>
          <pre className="h-auto md:h-full">
            <code className="language-javascript">
              {jobStatusState !== null &&
              Object.keys(jobStatusState).length !== 0 ? (
                <pre>{JSON.stringify(jobStatusState, null, 2)}</pre>
              ) : Object.keys(response).length === 0 ? (
                ""
              ) : response ? (
                <pre>{JSON.stringify(response, null, 2)}</pre>
              ) : (
                ""
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
