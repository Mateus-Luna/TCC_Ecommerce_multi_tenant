import BackButton from "../../components/BackButton/BackButton";
import { useCart } from "../../contexts/cart.context";
import { createOrder } from "../../services/orders.service";

export default function Cart() {
  const {
    items,
    totalPrice,
    removeItem,
    clearCart,
  } = useCart();

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
    <>
     <BackButton />
      <h1>Carrinho</h1>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3>{item.name}</h3>

              <p>Quantidade: {item.quantity}</p>

              <p>
                Valor unitário:
                {" "}
                R$ {item.price.toFixed(2)}
              </p>

              <p>
                Subtotal:
                {" "}
                R$
                {" "}
                {(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() =>
                  removeItem(item.id)
                }
              >
                Remover
              </button>
            </div>
          ))}

          <h2>
            Total:
            {" "}
            R$
            {" "}
            {totalPrice.toFixed(2)}
          </h2>

          <button onClick={handleCheckout}>
            Finalizar pedido
          </button>

          <button onClick={clearCart}>
            Limpar carrinho
          </button>
        </>
      )}
    </>
  );
}