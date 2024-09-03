import { Expose, Transform } from 'class-transformer';
import { Flight } from 'src/flight/entities/flight.entity';

export class BookingSeatsDto {
  @Expose()
  id: number;

  @Transform(({ obj }) => {
    return obj.user_id.first_name;
  })
  @Expose()
  first_name: string;

  @Transform(({ obj }) => {
    return obj.user_id.last_name;
  })
  @Expose()
  last_name: string;

  @Expose()
  price: number;

  @Expose()
  is_approved: boolean;

  @Transform(({ obj }) => {
    return {
      ...obj.flight_id,
      airplane: obj.airplane_id.name,
      seat_number: obj.seat_number,
    };
  })
  @Expose()
  flight: Flight;

  @Transform(({ obj }) => {
    return obj.return_flight_id
      ? {
          ...obj.return_flight_id,
          airplane: obj.airplane_id.name,
          seat_number: obj.return_seat_number,
        }
      : null;
  })
  @Expose()
  return_flight: Flight;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
