import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsEmail()
  @MaxLength(320)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '',
  )
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
