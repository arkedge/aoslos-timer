import React, { Suspense } from "react";
import ReactDOMClient from "react-dom/client";
import "./index.css";
import { TimerPage } from "./TimerPage";

const root = ReactDOMClient.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <TimerPage />
  </React.StrictMode>
);
