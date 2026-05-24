import { BadRequestException } from '@nestjs/common';
import { Tenant } from '@prisma/client';

export function resolveTenantId(
  tenant?: Tenant,
  queryTenantId?: number,
): number {
  const tenantId = tenant?.id ?? queryTenantId;

  if (!tenantId) {
    throw new BadRequestException(
      'Tenant context is required. Use a tenant-prefixed path (e.g. /tech-store/products) or provide ?tenantId=',
    );
  }

  return tenantId;
}
