import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orders.service";
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
  items: OrderItem[];
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await getMyOrders();

      setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <>
      <BackButton />

      <h1>Meus Pedidos</h1>

      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h3>
              Pedido: {order.id}
            </h3>

            <p>
              Status: {order.status}
            </p>

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