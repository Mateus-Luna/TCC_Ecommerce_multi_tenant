import { Request } from 'express';

export interface TenantRequest extends Request {
  user: {
    userId: string;
    tenantId: string;
  };
}