import { Request } from 'express';

export interface TenantRequest extends Request {
  tenantId: string;

  user?: {
    id: string;
    storeId: string;
  };
}