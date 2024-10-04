import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import { StoreProvider } from "./mobx/context/StoreContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#000000",
          borderRadius: 1920,

          // Alias Token
          colorBgContainer: "#ffffff",
        },
      }}
    >
      <StoreProvider>
        <App />
      </StoreProvider>
    </ConfigProvider>
  </StrictMode>
);
