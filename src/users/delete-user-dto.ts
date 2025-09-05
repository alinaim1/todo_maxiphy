import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class DeleteUserDto {
  @Matches(/^[^<>]*$/, { message: 'id must not contain HTML tags.' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
