import { createBrowserRouter } from "react-router-dom";
import loadable from "@loadable/component";
import Reports from "../components/reports";

//Utils
import { webRoutes } from "./web";

//Components
import AuthLayout from "../components/auth/AuthLayout";
import Login from "../components/auth/Login";
import ErrorPage from "../components/error/ErrorPage";
import ProgressBar from "../components/loader/ProgressBar";
import Layout from "../components/layout";
import UserDetail from "../components/user_detail";
import Redirect from "../components/layout/Redirect";
import RequireAuth from "./RequireAuth";
import NotFoundPage from "../components/error/NotFoundPage";
import Settings from "../components/settings";

//Load Pages
const Dashboard = loadable(() => import("../components/dashboard"), {
  fallback: <ProgressBar />,
});
const Users = loadable(() => import("../components/users"), {
  fallback: <ProgressBar />,
});
const UploadDocument = loadable(() => import("../components/upload_document"), {
  fallback: <ProgressBar />,
});
const UploadDocumentLlama = loadable(
  () => import("../components/upload_document_llama"),
  {
    fallback: <ProgressBar />,
  }
);
const UploadDocumentUnstructured = loadable(
  () => import("../components/upload_document_unstructured"),
  {
    fallback: <ProgressBar />,
  }
);
const Documents = loadable(() => import("../components/documents"), {
  fallback: <ProgressBar />,
});

export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: <ErrorPage />,
  },

  //Auth Routes
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: webRoutes.login,
        element: <Login />,
      },
    ],
  },

  //Protected Routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: webRoutes.dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.users,
        element: <Users />,
      },
      {
        path: webRoutes.uploadDocument,
        element: <UploadDocument />,
      },
      {
        path: webRoutes.uploadDocumentLlama,
        element: <UploadDocumentLlama />,
      },
      {
        path: webRoutes.uploadDocumentUnstructured,
        element: <UploadDocumentUnstructured />,
      },
      {
        path: webRoutes.document,
        element: <Documents />,
      },  
       {
        path: webRoutes.reports,
        element: <Reports />,
      },
      {
        path: webRoutes.settings,
        element: <Settings />,
      },
    ],
  },

  //User Detail
  {
    path: webRoutes.userDetail,
    element: (
      <RequireAuth>
        <UserDetail />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },

  // 404
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
]);
