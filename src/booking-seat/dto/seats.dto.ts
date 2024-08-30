import { Expose, Transform } from 'class-transformer';
import { Flight } from 'src/flight/entities/flight.entity';

export class BookingSeatsDto {
  @Expose()
  id: number;

  @Expose()
  seatNumber: number;

  @Transform(({ obj }) => {
    return obj.userId.firstName;
  })
  @Expose()
  firstName: string;

  @Transform(({ obj }) => {
    return obj.userId.lastName;
  })
  @Expose()
  lastName: string;

  @Transform(({ obj }) => {
    return obj.airplaneId.name;
  })
  @Expose()
  airplane: string;

  @Expose()
  price: number;

  @Expose()
  isApproved: boolean;

  @Transform(({ obj }) => {
    return obj.flightId;
  })
  @Expose()
  flight: Flight;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
