export type UserRole = "ADMIN" | "CUSTOMER" | "MASTER_ADMIN";

export interface User {
  id: string;
  role: UserRole;
  storeId?: string;
}
