import { IsNotEmpty, IsNumberString, MinLength } from 'class-validator';

export class createProjectDto {
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsNotEmpty()
  @MinLength(5)
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  categoryId: number;
}
