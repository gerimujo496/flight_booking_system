import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AirplaneDal } from 'src/airplane/airplane.dal';
import { FlightDal } from 'src/flight/flight.dal';
import { BookingSeatDal } from './bookingSeat.dal';
import { errorMessage } from 'src/constants/errorMessages';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { CreditDal } from 'src/credit/credit.dal';
import { UserDal } from 'src/user/user.dal';

@Injectable()
export class BookingSeatHelper {
  constructor(
    private airplaneDal: AirplaneDal,
    private flightDal: FlightDal,
    private bookingDal: BookingSeatDal,
    private creditDal: CreditDal,
    private userDal: UserDal,
  ) {}

  async arePropertiesValidAndCompatibleOrThrowError(
    createBookingSeatDto: CreateBookingSeatDto,
  ) {
    const { flightId, seatNumber, airplaneId } = createBookingSeatDto;

    const flight = await this.getFlightOrThrowError(flightId);

    const airplane = await this.getAirplaneOrThrowError(airplaneId);

    if (flight.airplaneId['id'] != airplaneId)
      throw new ConflictException(errorMessage.CONFLICT_AIRPLANE_WITH_FLIGHT);

    if (seatNumber > airplane.numOfSeats)
      throw new BadRequestException(
        errorMessage.SEAT_NUMBER_EXCEEDS_AIRPLANE_CAPACITY,
      );

    await this.throwErrorIfSeatIsNotFree(seatNumber, flightId, airplaneId);
  }

  async getAirplaneOrThrowError(id: number) {
    const airplane = await this.airplaneDal.findOneById(id);
    if (!airplane)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`airplane`, `airplaneId`, `${id}`),
      );

    return airplane;
  }

  async getFlightOrThrowError(id: number) {
    const flight = await this.flightDal.findOneById(id);
    if (!flight)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`flight`, `flightId`, `${id}`),
      );

    return flight;
  }
  async throwErrorIfSeatIsNotFree(
    seatNumber: number,
    flightId: number,
    airplaneId: number,
  ) {
    const isSeatFree = await this.bookingDal.isSeatFree(
      seatNumber,
      flightId,
      airplaneId,
    );
    if (!isSeatFree) throw new ConflictException(errorMessage.SEAT_IS_NOT_FREE);
  }

  async throwErrorIfCreditsAreNotEnough(id: number, price: number) {
    const { credits } = await this.creditDal.findOneByUserId(id);

    if (credits < price)
      throw new ForbiddenException(errorMessage.BALANCE_NOT_ENOUGH);
  }
  async newPriceOfPreferredBookingSeat(flightId: number) {
    const { price } = await this.flightDal.findOneById(flightId);
    const newPrice = price + 3000;

    return newPrice;
  }

  async getBookingOrThrowErrorIfItDoNotExists(id: number) {
    const booking = await this.bookingDal.findOneByIdJoinColumns(id);
    if (!booking)
      throw new NotFoundException(
        errorMessage.NOT_FOUND(`booking`, `id`, `${id}`),
      );

    return booking;
  }
}
