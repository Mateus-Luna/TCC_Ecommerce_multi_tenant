import { api } from "./Api";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export async function getProducts() {
  const response = await api.get<Product[]>("/products");

  return response.data;
}

export async function createProduct(productData: {
  name: string;
  price: number;
  imageUrl?: string;
}) {
  const response = await api.post<Product>("/products", productData);

  return response.data;
}

export async function updateProduct(
  id: string,
  productData: { name?: string; price?: number; imageUrl?: string }
) {
  const response = await api.patch<Product>(`/products/${id}`, productData);

  return response.data;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}
