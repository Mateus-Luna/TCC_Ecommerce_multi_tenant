import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";
import { useStore } from "../../contexts/store.context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { store } = useStore();

  function handleLogout() {
    logout();
    localStorage.removeItem("tenantId");
    navigate("/login");
  }

  return (
    <header
      style={{
        background: store?.primaryColor ?? "#2563eb",
        color: "white",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      >
      <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >

      {store?.logoUrl && (

        <img
          src={store.logoUrl}
          width={55}
          height={55}
          style={{
            borderRadius: "50%",
          }}
        />

      )}

      <div>

        <h2>{store?.name}</h2>

        <small>

          {store?.description}

        </small>

      </div>

    </div>

      <div className="navbar-nav">

        {user?.role && <span className="navbar-role">{user.role}</span>}

        {user?.role === "MASTER_ADMIN" && (
          <Link to="/master" className="navbar-link">Gestão de Lojas</Link>
        )}

        {user?.role === "CUSTOMER" && (
          <Link to="/my-orders" className="navbar-link">
            Meus Pedidos
          </Link>
        )}
        {user?.role !== "MASTER_ADMIN" && <Link to="/products" className="navbar-link">
          Produtos
        </Link>}

        {user?.role === "ADMIN" && (
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link to="/store-orders" className="navbar-link">
            Pedidos da Loja
          </Link>
        )}

        {user?.role === "CUSTOMER" && (
          <Link to="/cart" className="navbar-link">
            Carrinho ({totalItems})
          </Link>
        )}


        <button onClick={handleLogout} className="navbar-btn-logout"
        style={{

            background: store?.primaryColor,
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",

        }}>
          Sair
        </button>
      </div>
    </header>
  );
}
