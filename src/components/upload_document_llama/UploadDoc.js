import React, { useState, useEffect } from "react";
import { Button, Input, Upload, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  uploadDocument,
  checkJobStatus,
} from "../../redux/methods/documentMethods";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiFillAlert } from "react-icons/ai";

const { Title, Paragraph } = Typography;

export default function UploadDoc() {
  const [file, setFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [year, setYear] = useState("");
  const [jobStatusState, setJobStatusState] = useState(null);

  const dispatch = useDispatch();
  const { loading, jobStatus, errors } = useSelector(
    (state) => state.uploadDocumentReducer,
   
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


  // Error handling and job status effects remain the same

  const handleUploadDocument = async () => {
    if (!file || !companyName || !year) {
      toast.error("File, Company Name, and Year are required.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("company_name", companyName);
    formData.append("year", year);
    await dispatch(uploadDocument(formData, "llama"));

    await new Promise((resolve) => setTimeout(resolve, 2000));
    window.location.reload();
  };

  return (
    <div className="  bg-white  p-6">
      <div className="flex items-center ">
        <Title className="mt-3  text-2xl font-bold leading-8 text-left" level={3}>
          Create A New Record
        </Title>
        <span
          className={`text-sm mx-4 font-medium ${
            jobStatus.status === "ONGOING"
              ? "text-red-500 bg-red-100 px-3 py-1 rounded-md"
              : "text-green-500 bg-green-100 px-3 py-1 rounded-md"
          }`}
        >
          {jobStatus.status === "ONGOING" ? (
            <span className="flex items-center">
              <AiFillAlert className="mr-1" /> System is Busy
            </span>
          ) : (
            <span className="flex items-center">
              <AiFillCheckCircle className="mr-1" /> System is Available
            </span>
          )}
        </span>
      </div>
      <Paragraph className="mb-6 w-5/6 text-[15px] font-light leading-[22.5px] text-[#B0B0B0]">
        Create a new company record in CTI's database. In order to do that, you
        will need to provide the company's name, its sustainability report
        document, and the year for which you want to extract data.
      </Paragraph>
      <div className="space-y-4">
        <div>
          <label className="block text-[16px] font-bold leading-[24px] mb-1">
            Company Name:
          </label>
          <Input
            className="w-96  py-2 px-3 border border-gray-300 rounded-md"
            placeholder="Enter the name of the company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[16px] font-bold leading-[24px] mb-1">
            Reporting Year:
          </label>
          <Input
            className="w-96  py-2 px-3 border border-gray-300 rounded-md"
            placeholder="Enter the reporting year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="w-4/6 ">
          <label className="block text-[16px] font-bold leading-[24px] mb-1">
            Upload Document:
          </label>
          <Upload.Dragger
            className="  border-gray-300 rounded-md p-8 "
            accept=".pdf"
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
          >
            <p className="text-gray-500 ">
              Drag PDF file here or click to upload
            </p>
          </Upload.Dragger>
        </div>
      </div>
      <div className="flex  justify-between items-center mt-6">
        <Button
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={() => {
            setFile(null);
            setCompanyName("");
            setYear("");
          }}
        >
          Reset
        </Button>
        <Button
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          type="primary"
          loading={loading}
          onClick={handleUploadDocument}
          disabled={jobStatus.status === "ONGOING"}
        >
          Start Processing
        </Button>
      </div>
      <div>
        
      </div>
    </div>
  );
}
