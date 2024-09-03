import { BookingSeatHelper } from 'src/booking-seat/booking-seat.helper';
import { FlightDal } from './flight.dal';
import { AirplaneDal } from 'src/airplane/airplane.dal';
import { DataSource } from 'typeorm';
import { AirplaneService } from 'src/airplane/airplane.service';
import { Injectable } from '@nestjs/common';
import { Flight } from './entities/flight.entity';
import { BookingSeatDal } from 'src/booking-seat/bookingSeat.dal';

@Injectable()
export class FlightHelper {
  constructor(
    private airplaneService: AirplaneService,
    private dataSource: DataSource,
    private airplaneDal: AirplaneDal,
    private flightDal: FlightDal,
    private bookingSeatHelper: BookingSeatHelper,
    private bookingSeatDal: BookingSeatDal,
  ) {}

  async rejectAllBookingsAndReturnCredits(flight: Flight) {
    if (flight.departure_time < new Date()) return;

    const bookingsRelatedToFlight =
      await this.bookingSeatDal.getBookingsRelatedToFlight(flight.id);

    await this.bookingSeatDal.rejectBookingsRelatedToFlight(flight.id);
    const userIdsAndPrice = bookingsRelatedToFlight.map((data) => {
      return { userId: data.user_id['id'], price: data.price };
    });

    await this.bookingSeatDal.returnCreditsToRejectedBookingsUsers(
      userIdsAndPrice,
    );
  }
}
