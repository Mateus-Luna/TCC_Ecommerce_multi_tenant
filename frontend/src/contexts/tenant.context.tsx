import {
  createContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";

interface TenantContextType {
  tenantId: string | null;
  setTenantId: (tenantId: string) => void;
}

export const TenantContext =
  createContext<TenantContextType>(
    {} as TenantContextType,
  );

export function TenantProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [tenantId, setTenant] =
    useState<string | null>(null);
    
useEffect(() => {
  // Usuário ainda não carregou
  if (!user) {
    return;
  }

  // Apenas administradores possuem storeId fixo
  if (user.storeId) {
    setTenant(user.storeId);
    localStorage.setItem("tenantId", user.storeId);
    return;
  }

  // Clientes mantêm a loja escolhida anteriormente
  const savedTenant = localStorage.getItem("tenantId");

  if (savedTenant) {
    setTenant(savedTenant);
  }
}, [user]);

  function setTenantId(id: string) {

    localStorage.setItem(
      "tenantId",
      id,
    );

    setTenant(id);

  }

  return (
    <TenantContext.Provider
      value={{
        tenantId,
        setTenantId,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}
