import { IsNumberString, IsOptional } from 'class-validator';

export class searchParamsDto {
  @IsOptional()
  @IsNumberString()
  categoryId: number;

  @IsOptional()
  @IsNumberString()
  page: number;
}
