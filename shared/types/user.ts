export interface LoginRequest {
  email: string;
  password: string;
  role: Role;
  remember: boolean;
}

export type Role = "student" | "teacher" | "manager";

export interface LoginResponse {
  token: string;
  role: Role;
  userId: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
}
