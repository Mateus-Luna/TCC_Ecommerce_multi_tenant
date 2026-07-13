import { useContext } from "react";
import { AuthContext } from "../contexts/auth.contexts";

export function useAuth() {
  return useContext(AuthContext);
}