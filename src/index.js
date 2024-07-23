import React from "react";

//Packages
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";

//Components and Styles
import "./index.css";
import antdConfig from "./constants";
import App from "./App";
import Store from "./redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider {...antdConfig}>
      <Provider store={Store}>
        <App />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);
