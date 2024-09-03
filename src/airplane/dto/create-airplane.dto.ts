import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { z } from 'zod';

export const CreateAirplaneSchema = z.object({
  name: z.string().max(20, { message: 'Name must not exceed 20 characters' }),
  num_of_seats: z
    .number()
    .min(100, { message: 'Number of seats must be at least 100' })
    .max(500, { message: 'Number of seats must not exceed 500' }),
});

export class CreateAirplaneDto {
  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(20, { message: 'Name must not exceed 20 characters' })
  name: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Number of seats must be a number' })
  @Min(100, { message: 'Number of seats must be at least 100' })
  @Max(500, { message: 'Number of seats must not exceed 500' })
  @Type(() => Number) // Ensures the value is treated as a number
  num_of_seats: number;
}
