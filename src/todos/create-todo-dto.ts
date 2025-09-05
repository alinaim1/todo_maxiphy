import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^<>]*$/, { message: 'title must not contain HTML tags.' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^<>]*$/, { message: 'description must not contain HTML tags.' })
  description: string;

  @IsInt()
  @Min(1)
  @Max(3)
  priority: number; // 1 = Low, 2 = Medium, 3 = High

  @IsDateString()
  date: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;

  //   @IsString()
  //   @IsNotEmpty()
  //   @Matches(/^[^<>]*$/, { message: 'userId must not contain HTML tags.' })
  //   userId: string;
}
