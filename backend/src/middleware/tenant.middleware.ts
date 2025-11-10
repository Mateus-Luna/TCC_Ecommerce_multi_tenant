import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const host = req.hostname;
    const subdomain = host.split('.')[0];

    req.tenantId = subdomain; 

    next();
  }
}
