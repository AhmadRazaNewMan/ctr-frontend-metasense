
import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../redux/constants/constants";
import { getStructuredDocuments } from "../../redux/methods/documentMethods";
import { toast } from "sonner";
// import {format}

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
      key: webRoutes.report,
      title: <a href={webRoutes.reports}>Reports</a>,
    },
  ],
};

export default function Reports() {
  const dispatch = useDispatch();
  const { documents, loading } = useSelector(
    (state) => state.getStructuredDocumentsReducer
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    dispatch(getStructuredDocuments());
  }, [dispatch]);

  const handleSeeChanges = (record) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleAcceptChanges = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/document/accept-changes`, {
        id: currentRecord.id,
      });
      if (response.data.status) {
        toast.success("Changes accepted successfully");
        setIsModalVisible(false);
        dispatch(getStructuredDocuments());
      } else {
        toast.error("Failed to accept changes");
      }
    } catch (error) {
      console.error("Error accepting changes:", error);
      toast.error("Error accepting changes");
    }
  };

  const handleRejectChanges = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/document/reject-changes`, {
        id: currentRecord.id,
      });
      if (response.data.status) {
        toast.success("Changes rejected successfully");
        setIsModalVisible(false);
        dispatch(getStructuredDocuments());
      } else {
        toast.error("Failed to reject changes");
      }
    } catch (error) {
      console.error("Error rejecting changes:", error);
      toast.error("Error rejecting changes");
    }
  };

  const getFieldData = (record) => {
    const testingColumns = ['testing_column']; // Fields to include
    let oldData = {};

    try {
      oldData = record.testing_column ? JSON.parse(record.testing_column) : {};
    } catch (error) {
      console.warn("Error parsing old data:", error);
    }

    const fieldNames = Object.keys(record).filter(key => !testingColumns.includes(key));
    
    return fieldNames.map((key) => ({
      key,
      oldValue: oldData[key] !== undefined ? oldData[key] : record[key],
      newValue: record[key] !== undefined ? record[key] : '-',
    }));
  };

  const fieldData = currentRecord ? getFieldData(currentRecord) : [];

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
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        const date = new Date(text);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
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
      title: "Changes",
      dataIndex: "reported_by_admin",
      key: "reported_by_admin",
      render: (_, record) => (
        <Button type="link" onClick={() => handleSeeChanges(record)}>
          See the Changes
        </Button>
      ),
    },
  ];

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Table
        columns={columns}
        dataSource={documents}
        rowKey="id"
        loading={loading}
      />

      <Modal
        visible={isModalVisible}
        title="Review Changes"
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="accept"
            type="primary"
            onClick={handleAcceptChanges}
            className="bg-black text-white"
          >
            Accept Changes
          </Button>,
          <Button
            key="reject"
            onClick={handleRejectChanges}
            className="bg-black text-white"
          >
            Reject Changes
          </Button>,
        ]}
        className="max-w-4xl max-h-[80vh] overflow-auto"
      >
        {currentRecord && (
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex font-bold bg-gray-200 border-b border-gray-300">
                <div className="flex-1 p-2 border-r border-gray-300 truncate">Field Name</div>
                <div className="flex-1 p-2 border-r border-gray-300 truncate">Original Data</div>
                <div className="flex-1 p-2 truncate">Reported Data</div>
              </div>
              {fieldData.map(({ key, oldValue, newValue }) => (
                <div className="flex border-b border-gray-300" key={key}>
                  <div className="flex-1 p-2 border-r border-gray-300 truncate">{key}</div>
                  <div className="flex-1 p-2 border-r border-gray-300 truncate">{oldValue}</div>
                  <div className="flex-1 p-2 truncate">{newValue}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </BasePageContainer>
  );
}


