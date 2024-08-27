import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Country } from '../../types/country';

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MaxLength(20)
  lastName: string;

  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsEnum(Country)
  country: Country;

  @IsNumber()
  @Min(5000)
  @Max(15000)
  credits: number;
}
