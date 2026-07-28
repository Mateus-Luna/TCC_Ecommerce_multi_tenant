import { api } from "./Api";
import type { Store } from "./stores.service";

export interface DashboardMetrics {
  store: Store;
  products: number;
  customers: number;
  orders: number;
  pendingOrders: number;
  deliveredOrders: number;
  revenue: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await api.get<DashboardMetrics>("/dashboard");

  return data;
}
