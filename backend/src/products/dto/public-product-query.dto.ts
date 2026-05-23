import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ProductQueryDto } from './product-query.dto';

export class PublicProductQueryDto extends ProductQueryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  tenantId!: number;
}
