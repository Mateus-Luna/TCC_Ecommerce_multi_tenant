import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {


    const tenant = req.headers['x-tenant-id'];



    if (tenant) {
      req.tenantId = tenant;
      return next();
    }
    next();
  }
}