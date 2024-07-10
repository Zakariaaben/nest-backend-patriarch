import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
