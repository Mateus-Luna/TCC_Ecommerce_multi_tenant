import {
  useState, 
} from "react";

import type {
  FormEvent,
} from "react";

import {
  useAuth,
} from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";


export default function Login() {

  const {
    login,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    event: FormEvent,
  ) {

    event.preventDefault();

    setError("");
    setLoading(true);
    try {
      await login(email, password);
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role === "MASTER_ADMIN") {
        navigate("/master");
      } else if (payload.role === "ADMIN") {
        navigate("/products");
      } else {
        navigate("/select-store");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "E-mail ou senha incorretos.");
    } finally { setLoading(false); }
    }


  return (
    <div className="login-page">
      <form
        onSubmit={handleSubmit}
        className="login-card"
      >
        <h1 className="login-title">
          Login
        </h1>
        {location.state?.message && <p style={{ color: "var(--success, #15803d)" }}>{location.state.message}</p>}
        {error && <p style={{ color: "var(--error)" }}>{error}</p>}

        <div className="login-form-group">
          <div className="login-input-wrapper">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="login-input-wrapper">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button style={{ marginTop: "0.5rem" }} disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
          <Link to="/register">Ainda não possui cadastro? Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
  }
