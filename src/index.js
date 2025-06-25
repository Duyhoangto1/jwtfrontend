import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Giữ Bootstrap
import "antd/dist/reset.css"; // Thay antd.css bằng reset.css cho antd v5+
import { AppProvider } from "./contexts/AppContext";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
