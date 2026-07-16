import { api } from "./Api";

export interface Product {
  id: string;
  name: string;
  price: number;
}

export async function getProducts() {
  const response = await api.get<Product[]>("/products");

  return response.data;
}