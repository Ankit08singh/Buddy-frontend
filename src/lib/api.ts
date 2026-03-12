import type {
  LoginResponse,
  RegisterResponse,
  ChatResponse,
  EndSessionResponse,
  EmployeeListResponse,
  VibeTrendResponse,
} from "@/types";

const BASE_URL = "http://localhost:5000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("buddy_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    registerEmployee: (data: {
      name: string;
      email: string;
      password: string;
      department?: string;
      job_title?: string;
    }) =>
      request<RegisterResponse>("/api/auth/register/employee", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    registerAdmin: (data: { name: string; email: string; password: string }) =>
      request<RegisterResponse>("/api/auth/register/admin", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  chat: {
    sendMessage: (message: string) =>
      request<ChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),

    endSession: () =>
      request<EndSessionResponse>("/api/chat/end-session", {
        method: "POST",
      }),
  },

  admin: {
    getEmployees: () => request<EmployeeListResponse>("/api/admin/employees"),

    getVibeTrend: (employeeId: string) =>
      request<VibeTrendResponse>(`/api/admin/trend/${encodeURIComponent(employeeId)}`),
  },
};
