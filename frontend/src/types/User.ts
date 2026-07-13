export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  role: UserRole;
  storeId: string;
}