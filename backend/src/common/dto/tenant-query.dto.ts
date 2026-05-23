import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class TenantQueryDto {
  @ApiProperty({ example: 1, description: 'Tenant ID for public catalog requests' })
  @Type(() => Number)
  @IsInt()
  tenantId!: number;
}
