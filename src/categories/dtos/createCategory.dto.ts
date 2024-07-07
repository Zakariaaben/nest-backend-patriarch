import { IsNotEmpty, MinLength } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
