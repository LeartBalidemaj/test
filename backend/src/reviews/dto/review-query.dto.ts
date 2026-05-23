import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { TenantQueryDto } from '../../common/dto/tenant-query.dto';

export class ReviewQueryDto extends TenantQueryDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  productId!: number;
}
