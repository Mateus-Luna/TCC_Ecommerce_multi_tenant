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
    navigate("/products");

  }


  return (

    <form
      onSubmit={handleSubmit}
    >

      <h1>
        Login
      </h1>


      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />


      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />


      <button>
        Entrar
      </button>


    </form>

  );
}