import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;
}