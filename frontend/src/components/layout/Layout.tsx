import { useEffect, type ReactNode } from "react";
import Navbar from "./Navbar";
import { useStore } from "../../contexts/store.context";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  const { store } = useStore();

  useEffect(() => {
    if (!store) return;

    if (store.primaryColor) {
      document.documentElement.style.setProperty("--primary", store.primaryColor);
      document.documentElement.style.setProperty("--navbar-background", store.primaryColor);
    }
    if (store.secondaryColor) {
      document.documentElement.style.setProperty("--background", store.secondaryColor);
      document.documentElement.style.setProperty("--secondary", store.secondaryColor);
    }

    document.documentElement.dataset.storeId = store.id;
  }, [store]);

  return (
    <>
      <Navbar />

      <main className="layout-container" data-store-id={store?.id}>
        {children}
      </main>
    </>
  );
}
