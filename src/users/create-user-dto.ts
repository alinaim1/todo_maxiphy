import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  // Disallow angle brackets to help prevent script tags
  @Matches(/^[^<>]*$/, { message: 'Name must not contain HTML tags.' })
  name: string;

  @Matches(/^[^<>]*$/, { message: 'Email must not contain HTML tags.' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Matches(/^[^<>]*$/, { message: 'password must not contain HTML tags.' })
  @MinLength(6)
  password: string;
}
