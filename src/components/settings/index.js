import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../redux/constants/constants";
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";
import { Button, message, List, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <a href={webRoutes.dashboard}>Dashboard</a>,
    },
    {
      key: webRoutes.uploadDocument,
      title: <a href={webRoutes.uploadDocument}>Upload Document</a>,
    },
    
  ],
};

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [isButtonDisable,setIsButtonDisable] = useState(true)

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/document/getdropdownoption`);
        setOptions(response.data.data);
        message.success(response.data.message);
      } catch (error) {
        message.error("Failed to fetch dropdown options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSelectReason = (option) => {
    setIsButtonDisable(false)
    if (!selectedReasons.find((reason) => reason.id === option.id)) {
      setSelectedReasons((prev) => [...prev, option]);
      message.info(`Selected reason: ${option.question}`);
      
    } else {
      message.warning("This reason is already selected");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/document/admin-selected-reasons`, {
        selectedReasons: selectedReasons.map((reason) => reason.question), 
      });

      if (response.status === 200) {
        message.success(response.data.message);
        setSelectedReasons([]); 
        setIsButtonDisable(true)
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      
            console.error('Error in adminSelectedReason:', error); 
          }
    
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <Title level={3}>Add Reason for Reporting</Title>
      <div style={{ marginTop: 20 }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <List
            bordered
            dataSource={options}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleSelectReason(item)}
                style={{ cursor: 'pointer' }}
              >
                {item.question}
              </List.Item>
            )}
          />
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <Button disabled={isButtonDisable}  type={isButtonDisable ? "default" :"primary"} onClick={handleSubmit} style={isButtonDisable ? "" :{background:"black"}}>
          Submit Selected Reasons
        </Button>
      </div>
    </BasePageContainer>
  );
}
