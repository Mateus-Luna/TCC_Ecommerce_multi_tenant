import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/Api";
import { useTenant } from "../hooks/useTenant";
import type { Store } from "../services/stores.service";

interface StoreContextType {
  store: Store | null;
  loadStore: (id: string) => Promise<void>;
}

const StoreContext = createContext({} as StoreContextType);

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {

  const { tenantId } = useTenant();

  const [store, setStore] =
    useState<Store | null>(null);

  async function loadStore(id: string) {

    const { data } =
      await api.get(`/store/${id}`);

    setStore(data);

  }

  useEffect(() => {

    if (!tenantId) return;

    loadStore(tenantId);

  }, [tenantId]);

  return (

    <StoreContext.Provider
      value={{
        store,
        loadStore,
      }}
    >
      {children}
    </StoreContext.Provider>

  );
}

export function useStore() {
  return useContext(StoreContext);
}