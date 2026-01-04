import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Clarity from "@microsoft/clarity";
import "./index.css";
import App from "./App.tsx";

Clarity.init(import.meta.env.VITE_CLARITY_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
