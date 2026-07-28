import BackButton from "../../components/BackButton/BackButton";
import { useCart } from "../../contexts/cart.context";
import { createOrder } from "../../services/orders.service";
import { useAuth } from "../../hooks/useAuth";

export default function Cart() {
  const { user } = useAuth();
  const {
    items,
    totalPrice,
    removeItem,
    clearCart,
  } = useCart();

  if (user?.role === "ADMIN") {
    return (
      <div className="layout-container">
        <BackButton />
        <div className="empty-state">
          <h2>Acesso Restrito</h2>
          <p>Apenas clientes podem acessar o carrinho e realizar compras.</p>
        </div>
      </div>
    );
  }

    async function handleCheckout() {
        try {
        await createOrder({
            items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            })),
        });

        clearCart();

        alert("Pedido realizado com sucesso!");
        } catch {
        alert("Erro ao realizar pedido.");
        }
    }

  return (
    <div className="layout-container">
      <BackButton />
      <h1>Carrinho</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Seu carrinho está vazio.</p>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {items.map((item) => (
              <div
                key={item.id}
                className="cart-item-card"
              >
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <div className="cart-item-meta">
                    <span>Quantidade: <strong>{item.quantity}</strong></span>
                    <span>Valor unitário: <strong>R$ {item.price.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-subtotal">
                    Subtotal: <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                  <button
                    className="btn-danger"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-panel">
            <h2>Resumo da Compra</h2>
            <div className="summary-row">
              <span>Total:</span>
              <span className="summary-total-price">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="summary-actions">
              <button onClick={handleCheckout}>
                Finalizar pedido
              </button>
              <button
                className="btn-secondary"
                onClick={clearCart}
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}