import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "../types/User";
import { loginRequest } from "../services/auth.service";

interface JwtPayload {
  sub: string;
  role: "ADMIN" | "CUSTOMER" | "MASTER_ADMIN";
  storeId?: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      const payload = jwtDecode<JwtPayload>(savedToken);

      setToken(savedToken);

      setUser({
        id: payload.sub,
        role: payload.role,
        storeId: payload.storeId,
          });
    }

    setLoading(false);
  }, []);

  async function login(
    email: string,
    password: string,
  ) {
    const data = await loginRequest({
      email,
      password,
    });


    const token = data.access_token;

    const payload = jwtDecode<JwtPayload>(token);

    localStorage.setItem("token", token);

    setToken(token);

    setUser({
        id: payload.sub,
        role: payload.role,
        storeId: payload.storeId,
    });
  }

  function logout() {
    localStorage.removeItem("token");

    setUser(null);

    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
