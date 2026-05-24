import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class TenantQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Required when not using tenant-prefixed URLs',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tenantId?: number;
}
