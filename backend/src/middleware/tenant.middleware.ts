import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const tenantFromHeader = req.user.tenantId;
    if (tenantFromHeader) {
      req.tenantId = tenantFromHeader;
      return next();
    }
    const host = req.hostname;
    const subdomain = host.split('.')[0];
    req.tenantId = subdomain; 

    next();
  }
}
