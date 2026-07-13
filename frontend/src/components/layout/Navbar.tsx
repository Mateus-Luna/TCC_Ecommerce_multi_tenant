import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {

  const {
    user,
    logout,
  } = useAuth();

  return (

    <header>

      <h2>
        Multi-Tenant E-commerce
      </h2>

      <div>

        <span>

          {user?.role}

        </span>

        <button
          onClick={logout}
        >
          Sair
        </button>

      </div>

    </header>

  );

}