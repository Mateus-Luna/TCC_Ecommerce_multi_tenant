import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./contexts/auth.contexts";
import { TenantProvider } from "./contexts/tenant.context";
import { CartProvider } from "./contexts/cart.context";
import { StoreProvider } from "./contexts/store.context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AuthProvider>

      <TenantProvider>

        <StoreProvider>


        <CartProvider>
        <App />

        </CartProvider>
      </StoreProvider>

      </TenantProvider>

    </AuthProvider>

  </StrictMode>,
);