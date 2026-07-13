import { api } from "./Api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export async function loginRequest(
  data: LoginRequest,
) {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      data,
    );

  return response.data;
}