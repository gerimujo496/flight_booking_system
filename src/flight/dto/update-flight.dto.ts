import { Type } from 'class-transformer';
import { MinDate } from 'class-validator';

export class UpdateFlightDto {
  @Type(() => Date)
  @MinDate(new Date())
  departureTime: Date;

  @Type(() => Date)
  @MinDate(new Date())
  arrivalTime: Date;
}
