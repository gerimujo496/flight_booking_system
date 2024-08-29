import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { SeatDto } from './get-freeSeats.dto';

export class CreateBookingSeatDto extends SeatDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  flightId: number;

  @IsNumber()
  airplaneId: number;

  @IsNumber()
  @IsOptional()
  seatNumber: number;

  @Min(4000)
  @Max(10000)
  @IsOptional()
  price: number;
}
