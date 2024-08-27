import { IsEnum, IsNumber, Min, MinDate } from 'class-validator';
import { Airport } from 'src/types/airports';
import { Country } from 'src/types/country';

export class CreateFlightDto {
  @IsEnum(Country)
  departureCountry: Country;

  @IsEnum(Airport)
  departureAirport: Airport;

  @MinDate(new Date())
  departureTime: Date;

  @IsEnum(Country)
  arrivalCountry: Country;

  @IsEnum(Airport)
  arrivalAirport: Airport;

  @MinDate(new Date())
  arrivalTime: Date;

  @IsNumber()
  airplaneId: number;

  @IsNumber()
  @Min(0)
  price: number;
}
