import { ConfigProvider } from "antd";
import enUSIntl from "antd/locale/en_US";

const antdConfig = {
  theme: {
    token: {
      colorPrimary: "#000000",
    },
  },
  locale: enUSIntl,
};

ConfigProvider.config(antdConfig);

export default antdConfig;

