import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Country } from 'src/types/country';

export class FilterFlightDto {
  @IsOptional()
  @Type(() => Date)
  departureTime: Date;

  @IsOptional()
  @IsEnum(Country)
  arrivalCountry: Country;

  @IsOptional()
  @IsEnum(Country)
  departureCountry: Country;
}
