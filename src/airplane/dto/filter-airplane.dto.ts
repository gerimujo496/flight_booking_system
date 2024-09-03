import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { z } from 'zod';

export const FilterAirplaneSchema = z
  .object({
    arrival_time: z.date().refine((date) => date > new Date(), {
      message: 'Arrival time must be in the future',
    }),
    departure_time: z.date().refine((date) => date > new Date(), {
      message: 'Departure time must be in the future',
    }),
  })
  .refine((data) => data['departure_time'] < data['arrival_time'], {
    message: `Arrival time should be after departure time`,
  });

export class FilterAirplaneDto {
  @Type(() => Date)
  @IsDate()
  arrival_time: Date;

  @Type(() => Date)
  @IsDate()
  departure_time: Date;
}
