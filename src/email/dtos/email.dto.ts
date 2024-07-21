import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  familyName: string;

  typeOfProject: string = '';

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('DZ')
  phone: string;

  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  @IsEnum(['Professionnel', 'Particulier'])
  sender: 'Professionnel' | 'Particulier';
}
