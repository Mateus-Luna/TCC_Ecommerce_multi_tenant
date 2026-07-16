import { api } from "./Api";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface CreateOrderDto {
  items: OrderItem[];
}

export async function createOrder(dto: CreateOrderDto) {
  const { data } = await api.post("/orders", dto);

  return data;
}

export async function getMyOrders() {
  const { data } = await api.get("/orders/my-orders");

  return data;
}

export async function getStoreOrders() {
  const { data } = await api.get("/orders");

  return data;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
) {
  const { data } = await api.patch(
    `/orders/${orderId}/status`,
    {
      status,
    },
  );

  return data;
}