import { useEffect, useState } from "react";
import { getStoreOrders, updateOrderStatus } from "../../services/orders.service";
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

  const badgeClasses: Record<string, string> = {
    PENDING: "badge-pending",
    PAID: "badge-paid",
    SHIPPED: "badge-shipped",
    DELIVERED: "badge-delivered",
  };

  return (
    <div className="layout-container">
      <BackButton />

      <h1>Pedidos da Loja</h1>

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
                <p className="order-customer-email">
                  <strong>Cliente:</strong> {order.customer.email}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0.5rem 0" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Alterar Status:
                  </span>
                  <select
                    className="order-status-select"
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
                </div>

                <h4 className="order-products-title" style={{ marginTop: "1rem" }}>
                  Produtos:
                </h4>

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