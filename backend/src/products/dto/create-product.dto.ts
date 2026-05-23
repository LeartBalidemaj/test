import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiPropertyOptional({ example: 'Ergonomic wireless mouse' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 29.99 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  categoryId!: number;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    description: 'Primary product image URL',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
