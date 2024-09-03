import { Expose } from 'class-transformer';

export class FreeSeatsDto {
  @Expose()
  flightId: number;

  @Expose()
  airplaneId: number;

  @Expose()
  listOfFreeSeats: number[];
}
