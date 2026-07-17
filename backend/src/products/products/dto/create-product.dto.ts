import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
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
}