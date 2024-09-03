import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Country } from 'src/types/country';
import { z } from 'zod';

export const FilterFlightSchema = z.object({
  departure_time: z
    .date()
    .refine((date) => date > new Date(), {
      message: 'Departure time must be in the future',
    })
    .optional(),
  arrival_country: z.nativeEnum(Country).optional(),
  departure_country: z.nativeEnum(Country).optional(),
});

export class FilterFlightDto {
  @IsOptional()
  @Type(() => Date)
  departure_time: Date;

  @IsOptional()
  @IsEnum(Country)
  arrival_country: Country;

  @IsOptional()
  @IsEnum(Country)
  departure_country: Country;
}
