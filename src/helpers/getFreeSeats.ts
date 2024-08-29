import { Injectable } from '@nestjs/common';
import { BookingSeatHelper } from 'src/booking-seat/booking-seat.helper';
import { BookingSeatDal } from 'src/booking-seat/bookingSeat.dal';

@Injectable()
export class GetFreeSeatsHelper {
  constructor(
    private bookingSeatHelper: BookingSeatHelper,
    private bookingDal: BookingSeatDal,
  ) {}
  async getFreeSeats(flightId: number) {
    const flight = await this.bookingSeatHelper.getFlightOrThrowError(flightId);
    const airplane = await this.bookingSeatHelper.getAirplaneOrThrowError(
      flight.airplaneId['id'],
    );
    const takenSeatsArrayOfObject = await this.bookingDal.getTakenSeats(
      flight.id,
    );
    const takenSeatsArrayOfNumber = takenSeatsArrayOfObject.map(
      (item) => item.seatNumber,
    );
    const freeSeats = [];
    for (let i = 0; i < airplane.numOfSeats; i++) {
      if (!takenSeatsArrayOfNumber.includes(i)) {
        freeSeats.push(i);
      }
    }
    return {
      flightId: flight.id,
      airplaneId: airplane.id,
      listOfFreeSeats: freeSeats,
    };
  }
}
