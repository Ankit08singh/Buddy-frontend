import type {
  LoginResponse,
  RegisterEmployeeResponse,
  RegisterAdminResponse,
  ChatResponse,
  EndSessionResponse,
  GetEmployeesResponse,
  GetEmployeeTrendResponse,
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
      request<RegisterEmployeeResponse>("/api/auth/register/employee", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    registerAdmin: (data: { name: string; email: string; password: string }) =>
      request<RegisterAdminResponse>("/api/auth/register/admin", {
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
    getEmployees: () => 
      request<GetEmployeesResponse>("/api/admin/employees"),

    getVibeTrend: (employeeId: string) => 
      request<GetEmployeeTrendResponse>(`/api/admin/trend/${encodeURIComponent(employeeId)}`),

    // Endpoints below are explicitly documented as "Not Implemented" in the current backend
    // They are kept as placeholders that will throw 404/501 errors if called
    getTeamStats: () => {
      console.warn("getTeamStats is not implemented in backend. Using client-side computation.");
      throw new Error("NOT_IMPLEMENTED");
    },
    
    getTeamTrend: () => {
      console.warn("getTeamTrend is not implemented in backend.");
      throw new Error("NOT_IMPLEMENTED");
    },
    
    getGlobalAlerts: () => {
      console.warn("getGlobalAlerts is not implemented in backend.");
      throw new Error("NOT_IMPLEMENTED");
    }
  },
};
