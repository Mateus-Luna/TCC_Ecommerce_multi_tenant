import { api } from "./Api";

export interface Store {
  id: string;
  name: string;
  domain?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  phone?: string;
  email?: string;
  address?: string;
}

export async function getStores(): Promise<Store[]> {
  const { data } = await api.get("/store");

  return data;
}

export async function getStoreById(id: string): Promise<Store> {
  const { data } = await api.get(`/store/${id}`);

  return data;
}

export async function updateStoreBanner(id: string, bannerUrl: string | null): Promise<Store> {
  const { data } = await api.patch(`/store/${id}/banner`, { bannerUrl });
  return data;
}
