import { apiRequest } from "@/lib/api-client";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
};

export function login(email: string, password: string) {
  return apiRequest<AuthUser>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiRequest<{ logged_out: boolean }>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export function fetchCurrentUser() {
  return apiRequest<AuthUser>("/api/v1/auth/me");
}
