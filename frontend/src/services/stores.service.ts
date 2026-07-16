import { api } from "./Api";

export interface Store {
  id: string;
  name: string;
  domain: string;
}

export async function getStores() {
  const response = await api.get<Store[]>("/store");

  return response.data;
}