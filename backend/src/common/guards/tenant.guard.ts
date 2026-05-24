import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from '@prisma/client';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      tenant?: Tenant;
      tenantScoped?: boolean;
    }>();

    if (!request.tenantScoped) {
      return true;
    }

    if (!request.tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return true;
  }
}
