import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsString } from 'class-validator';
import { Country } from 'src/types/country';

export class FilterAirplaneDto {
  @Type(() => Date)
  @IsDate()
  arrival_time: Date;

  @Type(() => Date)
  @IsDate()
  departure_time: Date;
}
