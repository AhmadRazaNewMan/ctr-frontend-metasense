import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Components
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";
import {
  fetchCompaniesWithoutPDF,
  scrapPDFs,
} from "../../redux/methods/companiesMethods";
import { checkJobStatus } from "../../redux/methods/documentMethods";

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <a href={webRoutes.dashboard}>Dashboard</a>,
    },
    {
      key: webRoutes.report,
      title: <a href={webRoutes.reports}>Reports</a>,
    },
  ],
};

export default function Reports() {
  const [loadingButtons, setLoadingButtons] = useState({}); // State to track the loading and disabled status of each button
  const dispatch = useDispatch();
  const { companiesWithoutPDFs, loading } = useSelector(
    (state) => state.fetchCompaniesWithoutPDFReducer
  );
  const { jobStatus, errors } = useSelector(
    (state) => state.uploadDocumentReducer
  );

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((err) => {
        if (err.response) {
          toast.error(err.response.data.msg);
        } else {
          toast.error(err.message);
        }
      });
    }
  }, [errors]);

  useEffect(() => {
    dispatch(fetchCompaniesWithoutPDF());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkJobStatus());
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (jobStatus && jobStatus.company_name) {
      setLoadingButtons((prev) => ({
        ...prev,
        [jobStatus.company_name]: {
          loading: jobStatus.status !== "ONGOING",
          disabled: jobStatus.status === "ONGOING" || jobStatus.status === "COMPLETE",
        },
      }));
    }
  }, [jobStatus]);

  // const handleSeeChanges = (record) => {
  //   setCurrentRecord(record);
  // };

  const scrapData = (_, record) => {
    setLoadingButtons((prev) => ({
      ...prev,
      [record.company_name]: { loading: true, disabled: false },
    }));
    dispatch(scrapPDFs(record.company_name, record.year_of_emissions));
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        const date = new Date(text);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
          <>
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </>
        );
      },
    },
    {
      title: "Fetch PDF",
      dataIndex: "fetch_pdf",
      key: "fetch_pdf",
      render: (_, record) => {
        const isLoading = loadingButtons[record.company_name]?.loading;
        const isDisabled = loadingButtons[record.company_name]?.disabled;

        return (
          <Button
            onClick={() => scrapData(_, record)}
            className={`bg-black text-white p-2 rounded-md ${
              isDisabled ||isLoading ? "cursor-not-allowed bg-white" : ""
            }`}
            disabled={jobStatus.status==="ONGOING"}
          >
            {isLoading ? <Spin /> : "Fetch"}
          </Button>
        );
      },
    },
  ];

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Table
        columns={columns}
        dataSource={companiesWithoutPDFs}
        rowKey="id"
        loading={loading}
      />
    </BasePageContainer>
  );
}
