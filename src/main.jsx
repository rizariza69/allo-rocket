import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { RocketProvider } from "./context/RocketContext";
import "antd/dist/reset.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RocketProvider>
      <AppRoutes />
    </RocketProvider>
  </BrowserRouter>
);
