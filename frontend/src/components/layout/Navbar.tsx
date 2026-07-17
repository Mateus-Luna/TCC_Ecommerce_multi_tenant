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
    <header className="navbar">
      <h2 className="navbar-logo">E-commerce Multi-Tenant</h2>

      <div className="navbar-nav">
        <Link to="/products" className="navbar-link">
          Produtos
        </Link>

        {user?.role === "ADMIN" && (
          <Link to="/store-orders" className="navbar-link">
            Pedidos da Loja
          </Link>
        )}

        <Link to="/cart" className="navbar-link">
          Carrinho ({totalItems})
        </Link>

        {user?.role && <span className="navbar-role">{user?.role}</span>}

        {user?.role === "CUSTOMER" && (
          <Link to="/my-orders" className="navbar-link">
            Meus Pedidos
          </Link>
        )}

        <button onClick={handleLogout} className="navbar-btn-logout">
          Sair
        </button>
      </div>
    </header>
  );
}