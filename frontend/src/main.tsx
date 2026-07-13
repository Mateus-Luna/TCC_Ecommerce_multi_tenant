import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./contexts/auth.contexts";
import { TenantProvider } from "./contexts/tenant.context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AuthProvider>

      <TenantProvider>

        <App />

      </TenantProvider>

    </AuthProvider>

  </StrictMode>,
);