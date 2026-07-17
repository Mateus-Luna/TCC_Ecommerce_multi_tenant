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


export default function Login() {

  const {
    login,
  } = useAuth();

  const navigate = useNavigate();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  async function handleSubmit(
    event: FormEvent,
  ) {

    event.preventDefault();

    await login(
      email,
      password,
    );
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role === "ADMIN") {
        navigate("/products");
      } else {
        navigate("/select-store");
        }
      }
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

          <button style={{ marginTop: "0.5rem" }}>
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
  }
