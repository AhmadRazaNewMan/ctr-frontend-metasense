import React, { useState, useEffect } from "react";
import { Button, Input, Upload, Typography, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  uploadDocument,
  checkJobStatus,
} from "../../redux/methods/documentMethods";
import { AiFillCheckCircle, AiFillAlert } from "react-icons/ai";

const { Title, Paragraph } = Typography;

export default function UploadDoc() {
  const [file, setFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [year, setYear] = useState("");
  const [jobStatusState, setJobStatusState] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Store time in seconds

  const dispatch = useDispatch();
  const { loading, jobStatus, errors } = useSelector(
    (state) => state.uploadDocumentReducer
  );

  // Initialize state from localStorage
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    const storedYear = localStorage.getItem("year");
    const storedFile = localStorage.getItem("file");

    if (storedCompanyName) setCompanyName(storedCompanyName);
    if (storedYear) setYear(storedYear);
    if (storedFile) setFile(storedFile); // You might need to handle file differently
  }, []);

  // Display Errors
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

  // Check Status
  useEffect(() => {
    dispatch(checkJobStatus());
  }, [dispatch]);

  // Handle Timer when Job Status is Ongoing
  useEffect(() => {
    let interval = null;
    if (jobStatus.status === "ONGOING") {
      setJobStatusState(jobStatus);

      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setElapsedTime(0);
    }

    return () => clearInterval(interval);
  }, [jobStatus]);

  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

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

  const handleReset = () => {
    localStorage.removeItem("companyName");
    localStorage.removeItem("year");
    localStorage.removeItem("file");

    setFile(null);
    setCompanyName("");
    setYear("");
  };

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("year", year);
    if (file) {
      // File handling may need special treatment for storage
      localStorage.setItem("file", file.name); // Storing file name for simplicity
    }
  }, [companyName, year, file]);



  return (
    <div className="bg-white p-6">
      {jobStatus.status === "ONGOING" ? (
        <div>
          <Title className="text-2xl font-bold leading-8 text-left" level={3}>
            A record is being processed...
          </Title>
          <Paragraph className="text-[#B0B0B0]">
            Currently, the system is processing a new document that was just
            added. This processing must be completed before you can submit a new
            document. Below you can see the details of the process. On average
            this process would take 5-8 minutes.
          </Paragraph>
          <Progress
            percent={Math.floor(jobStatus.jobProcessed)}
            status="active"
            strokeColor="#52c41a"
            size={[1000, 30]}
            className="p-5 "
          />
          <div className="mt-4 border border-black">
            <div className="flex justify-between">
              <div class="border border-black pt-10">
                <p>
                  Company Name: <strong class="font-bold">Apple Inc.</strong>
                </p>{" "}
                <p>
                  Reporting Year: <strong class="font-bold">2018</strong>
                </p>{" "}
                <p>
                  Uploaded Document:{" "}
                  <strong class="font-bold">Apple-sustainability.pdf</strong>
                </p>{" "}
                <p>
                  Status: <strong class="font-bold">New</strong>
                </p>{" "}
                <p>
                  Message: <strong class="font-bold">Processing</strong>
                </p>{" "}
              </div>

              <div>
                <p className="text-right">
                  Time Elapsed:{" "}
                  <strong>{formatElapsedTime(elapsedTime)}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center">
            <Title className="text-2xl font-bold leading-8 text-left" level={3}>
              Create a New Record
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
            Create a new company record in CTI's database. In order to do that,
            you will need to provide the company's name, its sustainability
            report document, and the year for which you want to extract data.
          </Paragraph>
          <div className="space-y-4">
            <div>
              <label className="block text-[16px] font-bold leading-[24px] mb-1">
                Company Name:
              </label>
              <Input
                className="w-96 py-2 px-3 border border-gray-300 rounded-md"
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
                className="w-96 py-2 px-3 border border-gray-300 rounded-md"
                placeholder="Enter the reporting year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="w-4/6">
              <label className="block text-[16px] font-bold leading-[24px] mb-1">
                Upload Document:
              </label>
              <Upload.Dragger
                className="border-gray-300 rounded-md p-8"
                accept=".pdf"
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
              >
                <p className="text-gray-500">
                  Drag PDF file here or click to upload
                </p>
              </Upload.Dragger>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <Button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={handleReset}
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
        </div>
      )}
    </div>
  );
}
