import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { AirplaneDal } from 'src/airplane/airplane.dal';
import { FlightDal } from 'src/flight/flight.dal';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { BookingSeatDal } from './bookingSeat.dal';
import { BookingSeatHelper } from './booking-seat.helper';
import { RemoveCredit } from 'src/helpers/removeCredits';
import { GetFreeSeatsHelper } from 'src/helpers/getFreeSeats';

@Injectable()
export class BookingSeatService {
  constructor(
    private airplaneDal: AirplaneDal,
    private flightDal: FlightDal,
    private bookingDal: BookingSeatDal,
    private bookingSeatHelper: BookingSeatHelper,
    private removeCredit: RemoveCredit,
    private freeSeatsHelper: GetFreeSeatsHelper,
  ) {}

  async bookPreferredSeat(createBookingSeatDto: CreateBookingSeatDto) {
    try {
      const { userId, flightId, seatNumber } = createBookingSeatDto;

      if (!seatNumber)
        throw new BadRequestException(errorMessage.SEAT_NUMBER_REQUIRED);

      await this.bookingSeatHelper.arePropertiesValidAndCompatibleOrThrowError(
        createBookingSeatDto,
      );

      const newPrice =
        await this.bookingSeatHelper.newPriceOfPreferredBookingSeat(flightId);

      await this.bookingSeatHelper.throwErrorIfCreditsAreNotEnough(
        userId,
        newPrice,
      );

      const newSeatBookingDto = {
        ...createBookingSeatDto,
        price: newPrice,
      } as CreateBookingSeatDto;

      await this.removeCredit.removeCredits(userId, newPrice);

      const bookingSeat = await this.bookingDal.create(newSeatBookingDto);

      const bookingSeatJoinedWithColumns =
        await this.bookingDal.findOneByIdJoinColumns(bookingSeat.id);

      return bookingSeatJoinedWithColumns;
    } catch (error) {
      if (error instanceof ForbiddenException)
        throwError(HttpStatus.FORBIDDEN, error.message);

      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      if (error instanceof ConflictException)
        throwError(HttpStatus.CONFLICT, error.message);

      if (error instanceof BadRequestException)
        throwError(HttpStatus.BAD_REQUEST, error.message);

      throwError(
        HttpStatus.BAD_REQUEST,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `booking `),
      );
    }
  }
  async getFreeSeats(flightId: number) {
    try {
      return await this.freeSeatsHelper.getFreeSeats(flightId);
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(HttpStatus.BAD_REQUEST, error.message);
    }
  }

  async bookRandomSeat(createBookingSeatDto: CreateBookingSeatDto) {
    try {
      const { userId, flightId } = createBookingSeatDto;
      const { listOfFreeSeats } =
        await this.freeSeatsHelper.getFreeSeats(flightId);

      const randomSeat =
        listOfFreeSeats[Math.floor(Math.random() * listOfFreeSeats.length)];

      const newSeatBookingDto = {
        ...createBookingSeatDto,
        seatNumber: randomSeat,
      } as CreateBookingSeatDto;

      await this.bookingSeatHelper.arePropertiesValidAndCompatibleOrThrowError(
        newSeatBookingDto,
      );

      const { price } = await this.flightDal.findOneById(flightId);
      newSeatBookingDto.price = price;

      await this.bookingSeatHelper.throwErrorIfCreditsAreNotEnough(
        userId,
        price,
      );

      await this.removeCredit.removeCredits(userId, price);

      const bookingSeat = await this.bookingDal.create(newSeatBookingDto);

      const bookingSeatJoinedWithColumns =
        await this.bookingDal.findOneByIdJoinColumns(bookingSeat.id);

      return bookingSeatJoinedWithColumns;
    } catch (error) {
      if (error instanceof ForbiddenException)
        throwError(HttpStatus.FORBIDDEN, error.message);

      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      if (error instanceof ConflictException)
        throwError(HttpStatus.CONFLICT, error.message);

      if (error instanceof BadRequestException)
        throwError(HttpStatus.BAD_REQUEST, error.message);

      throwError(
        HttpStatus.BAD_REQUEST,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `booking `),
      );
    }
  }
  async findAll() {
    const allBookings = await this.bookingDal.findAllJoinColumns();

    return allBookings;
    try {
    } catch (error) {}
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingDal.findOneByIdJoinColumns(id);
      if (!booking)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`booking`, `id`, `${id}`),
        );

      return booking;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `booking`),
      );
    }
  }
  async approveBooking(id: number) {
    try {
      const booking =
        await this.bookingSeatHelper.getBookingOrThrowErrorIfItDoNotExists(id);

      const updatedResult = await this.bookingDal.approveBooking(booking.id);

      const otherBookings =
        await this.bookingDal.rejectBookingsAndReturnCredits(
          booking.id,
          booking.flightId['id'],
          booking.seatNumber,
        );
      console.log(otherBookings);
      return booking;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
