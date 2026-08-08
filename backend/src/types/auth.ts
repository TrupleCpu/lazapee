export interface loginDto {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  created_at: string;
}
