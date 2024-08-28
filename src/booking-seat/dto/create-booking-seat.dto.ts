import { IsNumber, Max, Min } from 'class-validator';

export class CreateBookingSeatDto {
  @IsNumber()
  flightId: number;

  @IsNumber()
  airplaneId: number;

  @IsNumber()
  seatNumber: number;

  @IsNumber()
  @Min(4000)
  @Max(10000)
  number: number;
}
