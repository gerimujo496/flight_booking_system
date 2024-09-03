import { z } from 'zod';

export const UpdateFlightSchema = z
  .object({
    departure_time: z.date().optional(),
    arrival_time: z.date().optional(),
  })
  .refine((data) => data['departure_time'] < data['arrival_time'], {
    message: `Arrival time should be after departure time`,
  });
import { Type } from 'class-transformer';
import { IsOptional, MinDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFlightDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @MinDate(new Date())
  departure_time: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @MinDate(new Date())
  arrival_time: Date;
}
