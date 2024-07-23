import React from "react";
import { Avatar, Card, Col, List, Row } from "antd";
import { Link } from "react-router-dom";
import Icon from "@ant-design/icons";
import { AiOutlineTeam } from "react-icons/ai";
import { MdOutlineArticle, MdOutlinePaid } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";

//Components
import BasePageContainer from "../layout/PageContainer";
import { webRoutes } from "../../routes/web";
import StatCard from "./StatCard";
import LazyImage from "../lazy-image";

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const users = [
  {
    id: 1,
    email: "george.bluth@reqres.in",
    first_name: "George",
    last_name: "Bluth",
    avatar: "https://reqres.in/img/faces/1-image.jpg",
  },
  {
    id: 2,
    email: "janet.weaver@reqres.in",
    first_name: "Janet",
    last_name: "Weaver",
    avatar: "https://reqres.in/img/faces/2-image.jpg",
  },
  {
    id: 3,
    email: "emma.wong@reqres.in",
    first_name: "Emma",
    last_name: "Wong",
    avatar: "https://reqres.in/img/faces/3-image.jpg",
  },
  {
    id: 4,
    email: "eve.holt@reqres.in",
    first_name: "Eve",
    last_name: "Holt",
    avatar: "https://reqres.in/img/faces/4-image.jpg",
  },
  {
    id: 5,
    email: "charles.morris@reqres.in",
    first_name: "Charles",
    last_name: "Morris",
    avatar: "https://reqres.in/img/faces/5-image.jpg",
  },
  {
    id: 6,
    email: "tracey.ramos@reqres.in",
    first_name: "Tracey",
    last_name: "Ramos",
    avatar: "https://reqres.in/img/faces/6-image.jpg",
  },
];

const Dashboard = () => {
  // const [loading, setLoading] = useState(true);

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            // loading={loading}
            icon={<Icon component={AiOutlineTeam} />}
            title="Users"
            number={6}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            // loading={loading}
            icon={<Icon component={MdOutlineArticle} />}
            title="Documents Uploaded"
            number={100}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            // loading={loading}
            icon={<Icon component={IoCloudUploadOutline} />}
            title="Number of Requests"
            number={100}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            // loading={loading}
            icon={<Icon component={MdOutlinePaid} />}
            title="Subscribed Users"
            number={6}
          />
        </Col>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <List
              // loading={loading}
              itemLayout="horizontal"
              dataSource={users}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="circle"
                        size="small"
                        src={
                          <LazyImage
                            src={user.avatar}
                            placeholder={
                              <div className="bg-gray-100 h-full w-full" />
                            }
                          />
                        }
                      />
                    }
                    title={`${user.first_name} ${user.last_name}`}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default Dashboard;
