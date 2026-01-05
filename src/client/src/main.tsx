import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Clarity from "@microsoft/clarity";
import "./config/axios";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

Clarity.init(import.meta.env.VITE_CLARITY_ID);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
