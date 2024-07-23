import { webRoutes } from "../../routes/web";
import { BiHomeAlt2 } from "react-icons/bi";
import { MdUploadFile } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import Icon, { UserOutlined } from "@ant-design/icons";

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: "Dashboard",
    icon: <Icon component={BiHomeAlt2} />,
  },
  {
    path: webRoutes.users,
    key: webRoutes.users,
    name: "Users",
    icon: <UserOutlined />,
  },
  // {
  //   path: webRoutes.uploadDocument,
  //   key: webRoutes.uploadDocument,
  //   name: "Upload Document",
  //   icon: <MdUploadFile />,
  // },
  {
    path: webRoutes.uploadDocumentLlama,
    key: webRoutes.uploadDocumentLlama,
    name: "Upload Document",
    icon: <MdUploadFile />,
  },
  // {
  //   path: webRoutes.uploadDocumentUnstructured,
  //   key: webRoutes.uploadDocumentUnstructured,
  //   name: "Upload UnStructured",
  //   icon: <MdUploadFile />,
  // },
  {
    path: webRoutes.document,
    key: webRoutes.document,
    name: "Documents",
    icon: <IoDocumentsOutline />,
  },
];
