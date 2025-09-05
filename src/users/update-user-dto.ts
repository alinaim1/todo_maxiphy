import {
  IsNotEmpty,
  MinLength,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @Matches(/^[^<>]*$/, { message: 'id must not contain HTML tags.' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  // Disallow angle brackets to help prevent script tags
  @Matches(/^[^<>]*$/, { message: 'Name must not contain HTML tags.' })
  name: string;

  @Matches(/^[^<>]*$/, { message: 'password must not contain HTML tags.' })
  @MinLength(6)
  @IsOptional()
  password: string;
}
