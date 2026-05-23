import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  productId!: number;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number = 1;
}
