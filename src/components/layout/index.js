import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ProLayout } from "@ant-design/pro-components";
import Icon, { LogoutOutlined } from "@ant-design/icons";
import { RiShieldUserFill } from "react-icons/ri";
import { Dropdown } from "antd";
import { supabase } from "../../config/supabase";
import { toast } from "sonner";

//Components
import { sidebar } from "./sidebar";
import { webRoutes } from "../../routes/web";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultProps = {
    title: "Climate Tracker Initiative",
    fixedHeader: true,
    fixSiderbar: true,
    layout: "mix",
    logo: null,
    route: {
      routes: sidebar,
    },
  };

  //Functions
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    }

    navigate("/login");
  };

  return (
    <div className="h-screen">
      <ProLayout
        {...defaultProps}
        token={{
          sider: {
            colorMenuBackground: "white",
          },
        }}
        location={location}
        onMenuHeaderClick={() => navigate(webRoutes.dashboard)}
        menuItemRender={(item, dom) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              item.path && navigate(item.path);
            }}
            href={item.path}
          >
            {dom}
          </a>
        )}
        avatarProps={{
          icon: <Icon component={RiShieldUserFill} />,
          className: "bg-primary bg-opacity-20 text-primary text-opacity-90",
          size: "small",
          shape: "square",
          title: "Admin",
          render: (_, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Logout",
                      onClick: () => {
                        handleLogout();
                      },
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
}
