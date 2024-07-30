import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Modal, Select as AntdSelect } from "antd";
import { toast } from "sonner";
import axios from "axios";
import Select from "react-select";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";

// Components
import { BASE_URL } from "../../redux/constants/constants";
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";
import Loader from "../loader";
import {
  addColumn,
  exportDocument,
  getStructuredDocuments,
} from "../../redux/methods/documentMethods";

//Supabase base
import { supabase } from "../../config/supabase";

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

const DraggableTable = ({ columns, rows, onviewReporting }) => {
  const [cols, setCols] = useState(columns);
  const [dragOver, setDragOver] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [colOrder, setColOrder] = useState({});

  useEffect(() => {
    const fetchColumnOrder = async () => {
      const { data, error } = await supabase
        .from("column_orders")
        .select("column_order")
        .single();

      if (data && data.column_order) {
        const orderedColumns = Object.keys(data.column_order)
          .sort((a, b) => data.column_order[a] - data.column_order[b])
          .map((col) => columns.find((c) => c.dataIndex === col));
        setCols(orderedColumns);
      } else if (error) {
        console.error("Error fetching column order:", error);
      }
    };

    fetchColumnOrder();
  }, [columns]);

  const handleDragStart = (e, idx) => {
    e.dataTransfer.setData("colIdx", idx);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragEnter = (e) => {
    const { id } = e.target;
    setDragOver(id);
  };

  const handleOnDrop = async (e, droppedColIdx) => {
    const draggedColIdx = e.dataTransfer.getData("colIdx");
    const tempCols = [...cols];

    // Swap columns
    [tempCols[draggedColIdx], tempCols[droppedColIdx]] = [
      tempCols[droppedColIdx],
      tempCols[draggedColIdx],
    ];

    setCols(tempCols);
    setDragOver("");

    // Log column names and order
    logColumnOrder(tempCols);

    // Save the new order to the database
    saveColumnOrder(tempCols);
  };

  const logColumnOrder = (columns) => {
    const newOrder = {};
    columns.forEach((col, index) => {
      newOrder[col.dataIndex] = index;
    });
    setColOrder(newOrder);
  };

  const saveColumnOrder = async (columnList) => {
    const column_order = columnList.reduce((acc, col, index) => {
      acc[col.dataIndex] = index;
      return acc;
    }, {});

    const { data, error } = await supabase
      .from("column_orders")
      .upsert({ id: "e4e2cecb-b8dd-4e02-94ae-6b09f94dbf2a", column_order });

    if (error) {
      console.error("Error saving column order:", error);
    } else {
      console.log("Column order saved:", data);
    }
  };

  // Calculate the paginated rows
  const paginatedRows = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(rows.length / pageSize);

  return (
    <>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {cols
                .filter((col) => col.dataIndex !== "testing_column")
                .map((col, idx) => (
                  <StyledTh
                    id={col.dataIndex}
                    key={col.dataIndex}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleOnDrop(e, idx)}
                    onDragEnter={handleDragEnter}
                    dragOver={col.dataIndex === dragOver}
                  >
                    {col.title}
                  </StyledTh>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {cols
                  .filter((col) => col.dataIndex !== "testing_column")
                  .map((col) => (
                    <StyledTd
                      key={col.dataIndex}
                      dragOver={col.dataIndex === dragOver}
                    >
                      {col.dataIndex === "reporting" ? (
                        <Button
                          type="link"
                          onClick={() => {
                            onviewReporting(row);
                          }}
                        >
                          View Reporting
                        </Button>
                      ) : col.dataIndex === "viewPDF" ? (
                        (row.source_1_link !== "-" ||
                          row.source_2_link !== "-") && (
                          <Button
                            type="link"
                            onClick={() => {
                              const source1Link = row.source_1_link;
                              const source2Link = row.source_2_link;

                              if (source1Link !== "-") {
                                window.open(source1Link, "_blank");
                              } else if (source2Link !== "-") {
                                window.open(source2Link, "_blank");
                              } else {
                                console.log("No valid source links available.");
                              }
                            }}
                          >
                            View PDF
                          </Button>
                        )
                      ) : (
                        row[col.dataIndex]
                      )}
                    </StyledTd>
                  ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Pagination Controls */}
      <Pagination>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Pagination>
    </>
  );
};

const Documents = () => {
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
  const [isReportingModalVisible, setIsReportingModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [newColumn, setNewColumn] = useState({
    name: "",
    type: "text",
  });

  const [form] = Form.useForm();

  useEffect(() => {
    if (currentRecord) {
      form.setFieldsValue(currentRecord);
    }
  }, [currentRecord, form]);

  const onviewReporting = (record) => {
    setCurrentRecord(record);
    setIsReportingModalVisible(true);
  };

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
        setIsImporting(false);
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
    // const excludeColumn = ['testing_column']
    const keys = Object.keys(documents[0]);

    const defaultColumns = keys
      // .filter(key => !excludeColumn.includes(key)) // Corrected this line
      .map((key) => ({
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

    // Add the "View PDF" column with a unique data index
    defaultColumns.push({
      title: "View PDF",
      dataIndex: "viewPDF",
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
        {!loading ? (
          <DndProvider backend={HTML5Backend}>
            <DraggableTable
              columns={columns}
              rows={documents}
              onviewReporting={onviewReporting}
            />
          </DndProvider>
        ) : (
          <Loader />
        )}
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

      {/* Reporting Modal  */}

      <Modal
        title="Reporting"
        visible={isReportingModalVisible}
        onCancel={() => {
          console.log("Cancel");
          setCurrentRecord(null); // Clear the current record
          setIsReportingModalVisible(false); // Hide the modal
          // setNonEditableMessage(false); // Reset the message
        }}
        footer={null}
      >
        {currentRecord && (
          <Form
            form={form}
            onFinish={async (values) => {
              try {
                const response = await axios.post(
                  `${BASE_URL}/api/document/save-orupdate`,
                  values
                );
                if (response.data.status) {
                  console.log("Data saved successfully", response.data.data);
                } else {
                  console.error("Failed to save data", response.data.msg);
                }
              } catch (error) {
                console.error("Error saving data", error);
              }

              setIsReportingModalVisible(false);
            }}
          >
            {Object.keys(currentRecord).map((key, index) => (
              <Form.Item
                key={key}
                label={key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                name={key}
              >
                <Input
                  disabled={index < 4}
                  onClick={() => {
                    if (index < 4) {
                      // setNonEditableMessage(true);
                      console.log("Message for non editable message ");
                    }
                  }}
                />
              </Form.Item>
            ))}
            {/* {nonEditableMessage && (
            <p style={{ color: 'red' }}>The first four fields cannot be changed.</p>
          )} */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ color: "white", background: "black" }}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </BasePageContainer>
  );
};

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  white-space: nowrap;
  color: #716f88;
  letter-spacing: 1.5px;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  padding: 20px;
  border-bottom: 2px solid #eef0f5;
  cursor: pointer;
  border-left: ${({ dragOver }) => dragOver && "5px solid black"};
`;

const StyledTd = styled.td`
  font-size: 14px;
  text-align: left;
  padding: 20px;
  border-bottom: 2px solid #eef0f5;
t   border-left: ${({ dragOver }) => dragOver && "5px solid black"};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;

  & > span {
    margin: 0 10px;
  }

  & > button {
    padding: 8px 16px;
    margin: 0 5px;
    font-size: 14px;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

export default Documents;
