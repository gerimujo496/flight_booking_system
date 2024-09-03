import { z } from 'zod';
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
import { ApiProperty } from '@nestjs/swagger';

import { Country } from '../../types/country';

export const CreateUserSchema = z.object({
  first_name: z.string().max(20, 'First name must be at most 20 characters'),
  last_name: z.string().max(20, 'Last name must be at most 20 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(50, 'Email must be at most 50 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters'),
  country: z.nativeEnum(Country),
  credits: z
    .number()
    .min(5000, 'Credits must be at least 5000')
    .max(15000, 'Credits must be at most 15000'),
});

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: 'First name must be at most 20 characters' })
  first_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: 'Last name must be at most 20 characters' })
  last_name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(50, { message: 'Email must be at most 50 characters' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  password: string;

  @ApiProperty()
  @IsEnum(Country)
  country: Country;

  @ApiProperty()
  @IsNumber()
  @Min(5000, { message: 'Credits must be at least 5000' })
  @Max(15000, { message: 'Credits must be at most 15000' })
  credits: number;
}
