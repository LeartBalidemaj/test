import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantsService } from './tenants.service';

const SKIP_PREFIXES = new Set(['api', 'auth', 'tenants', 'health']);

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantsService: TenantsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.path ?? req.url.split('?')[0];
    const segments = path.split('/').filter(Boolean);
    const firstSegment = segments[0];

    if (!firstSegment || SKIP_PREFIXES.has(firstSegment)) {
      return next();
    }

    const tenant = await this.tenantsService.findBySlug(firstSegment);

    if (!tenant || !tenant.isActive) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Tenant not found',
        error: 'Not Found',
      });
    }

    req['tenant'] = tenant;
    req['tenantScoped'] = true;

    const strippedPath = '/' + segments.slice(1).join('/');
    const queryIndex = req.url.indexOf('?');
    const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    req.url = (strippedPath === '/' ? '' : strippedPath) + query;

    next();
  }
}
