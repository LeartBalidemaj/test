import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ example: 'SAVE10' })
  @IsString()
  @MinLength(1)
  code!: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Order subtotal to apply the discount against',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number;
}
