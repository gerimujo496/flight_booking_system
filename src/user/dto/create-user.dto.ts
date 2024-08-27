import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Country } from '../types/country';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Country)
  country: Country;

  @IsNumber()
  @Min(5000)
  @Max(15000)
  credits: number;
}
