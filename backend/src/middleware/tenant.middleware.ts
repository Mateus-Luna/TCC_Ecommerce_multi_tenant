import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    const tenantFromHeader = req.headers['x-tenant-id'];

    if (tenantFromHeader) {
      req.tenantId = tenantFromHeader;
      return next();
    }

    if (req.user?.storeId) {
      req.tenantId = req.user.storeId;
      return next();
    }

    const host = req.hostname;
    const subdomain = host.split('.')[0];

    req.tenantId = subdomain;

    next();
  }
}