import { useEffect, useRef } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Avatar, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

//Components
import BasePageContainer from "../layout/PageContainer";
import LazyImage from "../lazy-image";
import { webRoutes } from "../../routes/web";
import { getAllUsers } from "../../redux/methods/userMethods";

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.users,
      title: <Link to={webRoutes.users}>Users</Link>,
    },
  ],
};

export default function Users() {
  const actionRef = useRef();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, users, errors } = useSelector(
    (state) => state.getUsersReducer
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

  //Get All Users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const columns = [
    {
      title: "Profile Image",
      dataIndex: "avatar",
      align: "center",
      sorter: false,
      render: (_, row) =>
        row.profile_image ? (
          <Avatar
            shape="circle"
            size="small"
            src={
              <LazyImage
                src={row.profile_image}
                placeholder={<div className="bg-gray-100 h-full w-full" />}
              />
            }
          />
        ) : (
          <Avatar shape="circle" size="small">
            {row.name.charAt(0).toUpperCase()}
          </Avatar>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: false,
      align: "center",
      ellipsis: true,
      render: (_, row) => `${row.name}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: false,
      align: "center",
      ellipsis: true,
    },
    {
      title: "",
      key: "actions",
      align: "center",
      render: (_, row) => {
        const handleUserDetail = () => {
          navigate(`/user-detail/${row.id}`);
        };

        return (
          <Button
            className="mt-4 bg-black"
            type="primary"
            size="large"
            onClick={handleUserDetail}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <ProTable
        columns={columns}
        cardBordered={false}
        cardProps={{
          title: "Info",
          tooltip: {
            className: "opacity-60",
            title: "Dummy data",
          },
        }}
        bordered={true}
        showSorterTooltip={false}
        scroll={{ x: true }}
        tableLayout={"fixed"}
        rowSelection={false}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        actionRef={actionRef}
        dataSource={users}
        dateFormatter="string"
        search={false}
        rowKey="id"
        loading={loading}
        options={{
          search: true,
        }}
      />
    </BasePageContainer>
  );
}
