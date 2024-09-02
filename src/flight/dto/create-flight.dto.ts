import { z } from 'zod';
import { Airport } from 'src/types/airports';
import { Country } from 'src/types/country';
import {
  IsDate,
  IsEnum,
  IsNumber,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const CreateFlightSchema = z
  .object({
    departure_country: z.nativeEnum(Country),
    departure_airport: z.nativeEnum(Airport),
    departure_time: z.date().refine((date) => date > new Date(), {
      message: 'Departure time must be in the future',
    }),
    arrival_country: z.nativeEnum(Country),
    arrival_airport: z
      .nativeEnum(Airport)
      .refine((data) => data['departure_airport'] == data['arrival_airport'], {
        message: 'departure airport should not be same as arrival airport',
      }),
    arrival_time: z.date().refine((date) => date > new Date(), {
      message: 'Arrival time must be in the future',
    }),
    airplane_id: z.number(),
    price: z.number().min(4000).max(10000),
  })
  .refine((data) => data.departure_airport !== data.arrival_airport, {
    message: 'Departure and arrival airports cannot be the same',
    path: ['arrival_airport'],
  });

export class CreateFlightDto {
  @ApiProperty()
  @IsEnum(Country, { message: 'Invalid departure country' })
  departure_country: Country;

  @ApiProperty()
  @IsEnum(Airport, { message: 'Invalid departure airport' })
  departure_airport: Airport;

  @ApiProperty()
  @IsDate()
  @ValidateIf((o) => o.departure_time)
  @Type(() => Date)
  departure_time: Date;

  @ApiProperty()
  @IsEnum(Country, { message: 'Invalid arrival country' })
  arrival_country: Country;

  @ApiProperty()
  @IsEnum(Airport, { message: 'Invalid arrival airport' })
  arrival_airport: Airport;

  @ApiProperty()
  @IsDate()
  @ValidateIf((o) => o.arrival_time)
  @Type(() => Date)
  arrival_time: Date;

  @ApiProperty()
  @IsNumber()
  airplane_id: number;

  @ApiProperty()
  @IsNumber()
  @Min(4000, { message: 'Price must be at least 4000' })
  @Max(10000, { message: 'Price must be at most 10000' })
  price: number;
}
