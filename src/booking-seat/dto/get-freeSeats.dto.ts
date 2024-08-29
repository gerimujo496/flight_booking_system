import { Expose } from 'class-transformer';

export class SeatDto {
  @Expose()
  flightId: number;

  @Expose()
  airplaneId: number;

  @Expose()
  listOfFreeSeats: number[];
}
