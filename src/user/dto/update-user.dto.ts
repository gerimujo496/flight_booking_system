import { z } from 'zod';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Country } from 'src/types/country';
import { ApiProperty } from '@nestjs/swagger';

export const UpdateUserSchema = z.object({
  first_name: z
    .string()
    .max(20, 'First name must be at most 20 characters')
    .optional(),
  last_name: z
    .string()
    .max(20, 'Last name must be at most 20 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .max(50, 'Email must be at most 50 characters')
    .optional(),
  country: z.nativeEnum(Country).optional(),
});

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: 'First name must be at most 20 characters' })
  @IsOptional()
  first_name?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(20, { message: 'Last name must be at most 20 characters' })
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(50, { message: 'Email must be at most 50 characters' })
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsEnum(Country)
  @IsOptional()
  country?: Country;
}
