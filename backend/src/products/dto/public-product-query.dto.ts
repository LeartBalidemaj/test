import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { ProductQueryDto } from './product-query.dto';

export class PublicProductQueryDto extends ProductQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Required when not using tenant-prefixed URLs',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tenantId?: number;
}
