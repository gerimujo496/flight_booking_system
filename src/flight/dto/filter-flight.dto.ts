import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Country } from 'src/types/country';

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
// import { z } from 'zod';
// import { Country } from 'src/types/country';

// export const FilterFlightSchema = z.object({
//   departure_time: z.date().optional(),
//   arrival_country: z.nativeEnum(Country).optional(),
//   departure_country: z.nativeEnum(Country).optional(),
// });

// export type FilterFlightDto = z.infer<typeof FilterFlightSchema>;
