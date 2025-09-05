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

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[^<>]*$/, { message: 'id must not contain HTML tags.' })
  id: string;

  @IsString()
  @IsOptional()
  @Matches(/^[^<>]*$/, { message: 'title must not contain HTML tags.' })
  title: string;

  @IsString()
  @IsOptional()
  @Matches(/^[^<>]*$/, { message: 'description must not contain HTML tags.' })
  description: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(3)
  priority: number;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
