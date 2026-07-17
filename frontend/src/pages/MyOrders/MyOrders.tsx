import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orders.service";
import BackButton from "../../components/BackButton/BackButton";
import { translateOrderStatus } from "../../utils/OrderStatus";

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

  const badgeClasses: Record<string, string> = {
    PENDING: "badge-pending",
    PAID: "badge-paid",
    SHIPPED: "badge-shipped",
    DELIVERED: "badge-delivered",
  };

  return (
    <div className="layout-container">
      <BackButton />

      <h1>Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-card"
            >
              <div className="order-header">
                <span className="order-id">
                  Pedido: #{order.id.slice(0, 8)}...
                </span>
                <span className={`badge ${badgeClasses[order.status] || ""}`}>
                  {translateOrderStatus(order.status)}
                </span>
              </div>

              <div className="order-details-meta">
                <h4 className="order-products-title">Produtos:</h4>
                <ul className="order-items-list">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="order-item-row"
                    >
                      <span className="order-item-name">
                        {item.product.name}
                      </span>
                      <span className="order-item-qty">
                        x{item.quantity}
                      </span>
                      <span className="order-item-price">
                        R$ {item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-footer">
                <span className="order-total-label">Total:</span>
                <span className="order-total-value">
                  R${" "}
                  {order.items
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}