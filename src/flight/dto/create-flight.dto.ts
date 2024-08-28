import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min, MinDate } from 'class-validator';
import { Airport } from 'src/types/airports';
import { Country } from 'src/types/country';

export class CreateFlightDto {
  @IsEnum(Country)
  departureCountry: Country;

  @IsEnum(Airport)
  departureAirport: Airport;

  @Type(() => Date)
  @MinDate(new Date())
  departureTime: Date;

  @IsEnum(Country)
  arrivalCountry: Country;

  @IsEnum(Airport)
  arrivalAirport: Airport;

  @Type(() => Date)
  @MinDate(new Date())
  arrivalTime: Date;

  @IsNumber()
  airplaneId: number;

  @IsNumber()
  @Min(4000)
  @Max(10000)
  price: number;
}
