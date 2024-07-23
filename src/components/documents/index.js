import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProTable } from "@ant-design/pro-components";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Modal, Select as AntdSelect } from "antd";
import { toast } from "sonner";
import axios from "axios";
import Select from "react-select";

// Components
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";
import {
  addColumn,
  exportDocument,
  getStructuredDocuments,
} from "../../redux/methods/documentMethods";
import { BASE_URL } from "../../redux/constants/constants";

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.document,
      title: <Link to={webRoutes.document}>Documents</Link>,
    },
  ],
};

export default function Documents() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [search, setSearch] = useState("");
  const [revenue, setRevenue] = useState("");
  const [conflicts, setConflicts] = useState([]);
  const [file, setFile] = useState(null);
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [isOverrideLoading, setIsOverrideLoading] = useState(false);
  const [isAddColumnModalVisible, setIsAddColumnModalVisible] = useState(false);
  const [newColumn, setNewColumn] = useState({
    name: "",
    type: "text",
  });

  const actionRef = useRef();
  const dispatch = useDispatch();
  const { documents, loading } = useSelector(
    (state) => state.getStructuredDocumentsReducer
  );
  const { loading: loadingDocument } = useSelector(
    (state) => state.uploadDocumentReducer
  );
  const {
    loading: loadingColumn,
    success,
    errors,
  } = useSelector((state) => state.addColumnReducer);

  //Get Countries
  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
      });
  }, []);

  //Displaying errors
  useEffect(() => {
    if (errors.length > 0) {
      errors.map((err) => toast.error(err.msg));
    }
  }, [errors]);

  //Display Success
  useEffect(() => {
    if (success) {
      toast.success("Column added successfully");
      setIsAddColumnModalVisible(false);
      setNewColumn({
        name: "",
        value: "",
        type: "text",
      });
      dispatch(getStructuredDocuments());
    }
  }, [success, dispatch]);

  // Get Structured Documents
  useEffect(() => {
    dispatch(getStructuredDocuments(search, selectedCountry.value, revenue));
  }, [search, dispatch, selectedCountry, revenue]);

  const handleExport = () => {
    dispatch(exportDocument());
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    handleImport(e.target.files[0]);
  };

  const handleImport = async (selectedFile) => {
    if (!selectedFile) {
      toast.error("File is required.");
      return;
    }
    setIsImporting(true);
    const formData = new FormData();
    formData.append("document", selectedFile);
    try {
      await axios.post(`${BASE_URL}/api/document/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error importing document:", error);
      if (error.response && error.response.status === 409) {
        setConflicts(error.response.data.conflicts);
        setCurrentConflictIndex(0);
        setIsModalVisible(true);
      }
    } finally {
      if (conflicts.length === 0) {
        setIsImporting(false); // End loading if no conflicts are detected
      }
    }
  };

  const handleConflictResolution = async (action) => {
    if (action === "skip") setIsSkipLoading(true);
    if (action === "override") setIsOverrideLoading(true);

    const currentConflict = conflicts[currentConflictIndex];
    try {
      const response = await axios.post(
        `${BASE_URL}/api/document/resolve-conflict`,
        { action, newRecord: currentConflict.newRecord },
        { validateStatus: (status) => status >= 200 && status < 500 }
      );

      if (response.data.status) {
        toast.success("Conflict resolved successfully");

        // Update conflicts and Modal state
        const updatedConflicts = conflicts.slice(1);
        if (updatedConflicts.length === 0) {
          setConflicts([]);
          setIsModalVisible(false);
          // Resume processing remaining records
          await processRemainingRecords();
          setIsImporting(false);
        } else {
          setConflicts(updatedConflicts);
          setCurrentConflictIndex(0);
        }
      } else if (response.status === 409) {
        // Handle additional conflicts
        setConflicts(response.data.conflicts);
        setCurrentConflictIndex(0);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error resolving conflict:", error);
    } finally {
      if (action === "skip") setIsSkipLoading(false);
      if (action === "override") setIsOverrideLoading(false);
    }
  };

  const processRemainingRecords = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/document/import-remaining`,
        { filePath: file.name }
      );
      if (response.data.status) {
        toast.success("Document Imported Successfully");
      } else {
        setConflicts(response.data.conflicts);
        setCurrentConflictIndex(0);
        setIsModalVisible(true);
      }
      dispatch(getStructuredDocuments());
    } catch (error) {
      console.error("Error processing remaining records:", error);
    }
  };

  const openAddColumnModal = () => {
    setIsAddColumnModalVisible(true);
  };

  // Dynamically generate columns based on document keys
  const generateColumns = (documents) => {
    if (!documents.length) return [];
    const keys = Object.keys(documents[0]);
    const defaultColumns = keys.map((key) => ({
      title: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      dataIndex: key,
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (text) => {
        if (key === "username") {
          return text.length > 3 ? `${text.slice(0, 3)}...` : text;
        }
        return text;
      },
    }));

    // Add the "View PDF" column
    defaultColumns.push({
      title: "View PDF",
      dataIndex: "viewPDF",
      render: (_, record) => {
        const handleViewPDF = () => {
          const source1Link = record.source_1_link;
          const source2Link = record.source_2_link;

          if (source1Link !== "-") {
            window.open(source1Link, "_blank");
          } else if (source2Link !== "-") {
            window.open(source2Link, "_blank");
          } else {
            console.log("No valid source links available.");
          }
        };

        return (
          (record.source_1_link !== "-" || record.source_2_link !== "-") && (
            <Button type="link" onClick={handleViewPDF}>
              View PDF
            </Button>
          )
        );
      },
    });

    return defaultColumns;
  };
  const columns = generateColumns(documents);

  const handleAddColumn = () => {
    const columnName = newColumn.name.toLowerCase().replace(/ /g, "_");

    dispatch(addColumn(columnName, newColumn.type));
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div>
        <div className="flex justify-between items-center mb-4 ml-2">
          <div className="flex items-center space-x-4 w-1/2">
            <Input.Search
              placeholder="Search Company Name"
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(value) => setSearch(value)}
              className="w-1/2"
            />
            <Select
              isClearable={true}
              options={countries}
              value={selectedCountry}
              onChange={(selectedOption) =>
                setSelectedCountry(selectedOption || {})
              }
              className="w-1/3"
            />
            <Input.Search
              placeholder="Search Revenue"
              allowClear
              onChange={(e) => setRevenue(e.target.value)}
              onSearch={(value) => setRevenue(value)}
              className="w-1/2"
            />
          </div>
          <div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              className="mr-5 bg-black"
              type="primary"
              size="large"
              loading={isImporting}
              onClick={() => document.getElementById("fileInput").click()}
            >
              Import
            </Button>
            <Button
              className="bg-black mr-5"
              type="primary"
              size="large"
              loading={loadingDocument}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              className="mr-5 bg-black"
              type="primary"
              size="large"
              onClick={() => openAddColumnModal()}
            >
              Add Column
            </Button>
          </div>
        </div>
        <ProTable
          columns={columns}
          cardBordered={false}
          bordered={true}
          showSorterTooltip={false}
          scroll={{ x: true }}
          tableLayout={"fixed"}
          rowSelection={false}
          pagination={{ showQuickJumper: true, pageSize: 20 }}
          actionRef={actionRef}
          dataSource={documents}
          dateFormatter="string"
          search={false}
          rowKey="id"
          options={true}
          loading={loading}
        />
      </div>

      {/* Import Modal */}
      <Modal
        open={isModalVisible}
        title="Conflict Detected"
        footer={[
          <Button
            key="skip"
            onClick={() => handleConflictResolution("skip")}
            loading={isSkipLoading}
          >
            Skip
          </Button>,
          <Button
            key="override"
            className="bg-black"
            type="primary"
            size="middle"
            onClick={() => handleConflictResolution("override")}
            loading={isOverrideLoading}
          >
            Override
          </Button>,
        ]}
      >
        <p>
          Conflict detected for company:{" "}
          {conflicts[currentConflictIndex]?.newRecord?.company_name}
        </p>
        <p>
          Year of emissions:{" "}
          {conflicts[currentConflictIndex]?.newRecord?.year_of_emissions}
        </p>
      </Modal>

      {/* Add Column Modal */}
      <Modal
        open={isAddColumnModalVisible}
        title="Add New Column"
        onCancel={() => setIsAddColumnModalVisible(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            className="bg-black"
            loading={loadingColumn}
            onClick={handleAddColumn}
          >
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Column Name">
            <Input
              value={newColumn.name}
              onChange={(e) =>
                setNewColumn({ ...newColumn, name: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Column Type">
            <AntdSelect
              value={newColumn.type}
              onChange={(value) => setNewColumn({ ...newColumn, type: value })}
            >
              <AntdSelect.Option value="int2">Int2</AntdSelect.Option>
              <AntdSelect.Option value="int4">Int4</AntdSelect.Option>
              <AntdSelect.Option value="int8">Int8</AntdSelect.Option>
              <AntdSelect.Option value="float4">Float4</AntdSelect.Option>
              <AntdSelect.Option value="float8">Float8</AntdSelect.Option>
              <AntdSelect.Option value="numeric">Numeric</AntdSelect.Option>
              <AntdSelect.Option value="text">Text</AntdSelect.Option>
              <AntdSelect.Option value="varchar">Varchar</AntdSelect.Option>
              <AntdSelect.Option value="uuid">UUID</AntdSelect.Option>
            </AntdSelect>
          </Form.Item>
        </Form>
      </Modal>
    </BasePageContainer>
  );
}
