export type UserRole = "employee" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employee_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface LoginResponse {
  token: string;
  role: UserRole;
  employee_id?: string;
}

export interface RegisterEmployeeResponse {
  token: string;
  role: "employee";
  employee_id: string;
}

export interface RegisterAdminResponse {
  token: string;
  role: "admin";
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export interface EndSessionResponse {
  ended: boolean;
  message: string;
}

// Export all enum types
export * from "./enums";
// Export all admin types  
export * from "./admin";
// Export all chart types
export * from "./charts";
// Export all UI types
export * from "./ui";
