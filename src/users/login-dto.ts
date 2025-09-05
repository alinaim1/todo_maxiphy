import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  // Disallow angle brackets to help prevent script tags
  @Matches(/^[^<>]*$/, { message: 'Email must not contain HTML tags.' })
  email: string;

  @Matches(/^[^<>]*$/, { message: 'password must not contain HTML tags.' })
  @MinLength(6)
  password: string;
}
