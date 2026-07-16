import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      <h2>E-commerce Multi-Tenant</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Link to="/products">
          Produtos
      </Link>

      {user?.role === "ADMIN" && (
        <Link to="/store-orders">
          Pedidos da Loja
        </Link>
      )}

      <Link to="/cart">
          Carrinho ({totalItems})
      </Link>
        <span>{user?.role}</span>

      {user?.role === "CUSTOMER" && (
        <Link to="/my-orders">
          Meus Pedidos
        </Link>
      )}

        <button onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}