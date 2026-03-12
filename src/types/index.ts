export type Role = "employee" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  employee_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface LoginResponse {
  token: string;
  role: Role;
  employee_id?: string;
}

export interface RegisterResponse {
  token: string;
  role: Role;
  employee_id?: string;
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
