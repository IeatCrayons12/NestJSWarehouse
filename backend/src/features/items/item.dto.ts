import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  sku?: string;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsInt() @Min(0) @Type(() => Number)
  quantity?: number;

  @IsOptional() @IsNumber() @Type(() => Number)
  price?: number;

  @IsOptional() @IsString()
  location?: string;
}

export class UpdateItemDto extends CreateItemDto {}
