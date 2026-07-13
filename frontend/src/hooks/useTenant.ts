import { useContext } from "react";
import { TenantContext } from "../contexts/tenant.context";

export function useTenant() {
  return useContext(TenantContext);
}