import { useEffect, useState } from "react";
import { getStoreOrders, updateOrderStatus } from "../../services/orders.service";
import BackButton from "../../components/BackButton/BackButton";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  customer: {
    email: string;
  };
  items: OrderItem[];
}

export default function StoreOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await getStoreOrders();

      setOrders(data);
    }

    loadOrders();
  }, []);

  async function handleStatusChange(
    orderId: string,
    status: string,
    ) {
    await updateOrderStatus(
        orderId,
        status,
    );

    const updatedOrders = await getStoreOrders();

    setOrders(updatedOrders);
    }

  return (
    <>
      <BackButton />

      <h1>Pedidos da Loja</h1>

      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>
              Pedido: {order.id}
            </h3>

            <p>
              Cliente: {order.customer.email}
            </p>

            <p>
              Status: {order.status}
            </p>

            <select
                value={order.status}
                onChange={(e) =>
                    handleStatusChange(
                    order.id,
                    e.target.value,
                    )
                }
                >
                <option value="PENDING">
                    Pendente
                </option>

                <option value="SHIPPED">
                    Enviado
                </option>

                <option value="DELIVERED">
                    Entregue
                </option>

            </select>

            <h4>Produtos:</h4>

            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name}
                  {" - "}
                  Quantidade: {item.quantity}
                  {" - "}
                  R$ {item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </>
  );
}