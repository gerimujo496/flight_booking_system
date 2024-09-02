import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(50, 'Email must be at most 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export class SignInDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(50, { message: 'Email must be at most 50 characters' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
