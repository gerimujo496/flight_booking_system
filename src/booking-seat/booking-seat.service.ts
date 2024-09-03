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
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingSeatService {
  constructor(
    private airplaneDal: AirplaneDal,
    private flightDal: FlightDal,
    private bookingDal: BookingSeatDal,
    private bookingSeatHelper: BookingSeatHelper,
    private removeCredit: RemoveCredit,
    private freeSeatsHelper: GetFreeSeatsHelper,
    private readonly emailService: EmailService,
  ) {}

  async bookSeat(createBookingSeatDto: CreateBookingSeatDto) {
    try {
      const { user_id } = createBookingSeatDto;
      await this.bookingSeatHelper.throwErrorIfUserDoNotExists(user_id);

      const isRoundTrip =
        this.bookingSeatHelper.isRoundTripOrThrowErrorIfFlightsAreSame(
          createBookingSeatDto,
        );

      if (isRoundTrip) return this.bookRoundFlight(createBookingSeatDto);

      const newCreateBookingSeatDto = {
        ...createBookingSeatDto,
        return_airplane_id: null,
        return_flight_id: null,
        return_seat_number: null,
      } as CreateBookingSeatDto;

      return this.bookOneWayFlight(newCreateBookingSeatDto);
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

  async bookRoundFlight(createBookingSeatDto: CreateBookingSeatDto) {
    const {
      user_id,
      flight_id,
      airplane_id,
      seat_number,
      return_flight_id,
      return_airplane_id,
      return_seat_number,
    } = createBookingSeatDto;

    const firstSeatNumber =
      seat_number || (await this.generateRandomSeat(flight_id));

    const secondSeatNumber: number =
      return_seat_number || (await this.generateRandomSeat(return_flight_id));

    await this.bookingSeatHelper.arePropertiesValidAndCompatibleOrThrowError({
      flight_id,
      seat_number: firstSeatNumber,
      airplane_id,
    });

    await this.bookingSeatHelper.arePropertiesValidAndCompatibleOrThrowError({
      flight_id: return_flight_id,
      seat_number: secondSeatNumber,
      airplane_id: return_airplane_id,
    });

    const newPrice = await this.bookingSeatHelper.calculatePrice({
      flightId: flight_id,
      seat_number,
      return_seat_number,
      isRoundTrip: true,
    });

    await this.bookingSeatHelper.throwErrorIfCreditsAreNotEnough(
      user_id,
      newPrice,
    );

    const newSeatBookingDto = {
      ...createBookingSeatDto,
      return_seat_number: secondSeatNumber,
      seat_number: firstSeatNumber,
      price: newPrice,
    } as CreateBookingSeatDto;

    await this.removeCredit.removeCredits(user_id, newPrice);
    const bookingSeat = await this.bookingDal.create(newSeatBookingDto);

    const bookingSeatJoinedWithColumns =
      await this.bookingDal.findOneByIdJoinColumns(bookingSeat.id);

    return bookingSeatJoinedWithColumns;
  }
  async bookOneWayFlight(createBookingSeatDto: CreateBookingSeatDto) {
    const { user_id, flight_id, airplane_id, seat_number } =
      createBookingSeatDto;
    const firstSeatNumber =
      seat_number || (await this.generateRandomSeat(flight_id));

    await this.bookingSeatHelper.arePropertiesValidAndCompatibleOrThrowError({
      flight_id,
      seat_number: firstSeatNumber,
      airplane_id,
    });

    const newPrice = await this.bookingSeatHelper.calculatePrice({
      flightId: flight_id,
      seat_number,
      return_seat_number: null,
      isRoundTrip: false,
    });

    await this.bookingSeatHelper.throwErrorIfCreditsAreNotEnough(
      user_id,
      newPrice,
    );
    const newSeatBookingDto = {
      ...createBookingSeatDto,
      seat_number: firstSeatNumber,
      price: newPrice,
    } as CreateBookingSeatDto;

    await this.removeCredit.removeCredits(user_id, newPrice);
    const bookingSeat = await this.bookingDal.create(newSeatBookingDto);

    const bookingSeatJoinedWithColumns =
      await this.bookingDal.findOneByIdJoinColumns(bookingSeat.id);

    return bookingSeatJoinedWithColumns;
  }

  async generateRandomSeat(flightId: number) {
    const { listOfFreeSeats } =
      await this.freeSeatsHelper.getFreeSeats(flightId);
    if (listOfFreeSeats.length == 0)
      throw new ConflictException(errorMessage.NO_AVAILABLE_SEATS);
    const randomSeat =
      listOfFreeSeats[Math.floor(Math.random() * listOfFreeSeats.length)];

    return randomSeat;
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

  async findAll() {
    try {
      const allBookings = await this.bookingDal.findAllJoinColumns();

      return allBookings;
    } catch (error) {
      throwError(
        HttpStatus.BAD_REQUEST,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `all booking `),
      );
    }
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

      throwError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async approveBooking(id: number) {
    try {
      const booking =
        await this.bookingSeatHelper.getBookingOrThrowErrorIfItDoNotExists(id);

      if (booking.is_approved)
        throw new ConflictException(errorMessage.BOOKING_CONFLICT(`approved`));

      await this.bookingDal.approveBooking(booking.id);
      const bookingsWithSameSeatNumberForFlight =
        await this.bookingDal.getBookingWithSameSeatNumber(
          booking.id,
          booking.flight_id['id'],
          booking.seat_number,
        );

      const userIdAndPrice = bookingsWithSameSeatNumberForFlight.map(
        (booking) => {
          return { userId: booking.user_id['id'], price: booking.price };
        },
      );

      await this.bookingDal.rejectBookingsWithSameSeatNumber(
        booking.id,
        booking.flight_id['id'],
        booking.seat_number,
      );

      await this.bookingDal.returnCreditsToRejectedBookingsUsers(
        userIdAndPrice,
      );

      const approvedBooking = await this.bookingDal.findOneByIdJoinColumns(
        booking.id,
      );

      await this.emailService.sendApprovedBooking(
        booking.user_id['email'],
        booking,
      );

      for (const booking of bookingsWithSameSeatNumberForFlight) {
        await this.emailService.sendRejectedBooking(
          booking.user_id['email'],
          booking,
        );
      }

      return approvedBooking;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      if (error instanceof ConflictException)
        throwError(HttpStatus.CONFLICT, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`approve`, `booing`),
      );
    }
  }
  async printApprovedTicket(id: number) {
    try {
      const booking =
        await this.bookingSeatHelper.getBookingOrThrowErrorIfItDoNotExists(id);

      if (!booking.is_approved)
        throw new ConflictException(errorMessage.BOOKING_IS_NOT_APPROVED);

      const pdfBuffer = await this.bookingSeatHelper.generateTicketPdf(booking);

      return pdfBuffer;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      if (error instanceof ConflictException)
        throwError(HttpStatus.CONFLICT, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`print`, `booking`),
      );
    }
  }

  async rejectBooking(id: number) {
    try {
      const booking =
        await this.bookingSeatHelper.getBookingOrThrowErrorIfItDoNotExists(id);

      if (booking.is_approved == false)
        throw new ConflictException(errorMessage.BOOKING_CONFLICT('rejected'));

      const { price } = booking;
      const userId = booking.user_id['id'];

      await this.bookingDal.rejectBooking(id);

      await this.bookingDal.returnCreditsToRejectedBookingsUsers([
        {
          userId: userId,
          price,
        },
      ]);

      const rejectedBooking = await this.bookingDal.findOneByIdJoinColumns(id);
      if (!rejectedBooking.is_approved)
        await this.emailService.sendRejectedBooking(
          rejectedBooking.user_id['email'],
          rejectedBooking,
        );

      return rejectedBooking;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      if (error instanceof ConflictException)
        throwError(HttpStatus.CONFLICT, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`print`, `booking`),
      );
    }
  }
  async getBookingHistory(id: number) {
    try {
      const bookings = await this.bookingDal.getUserBookingHistory(id);

      return bookings;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `booking history`),
      );
    }
  }
  async totalRevenue() {
    try {
      const totalRevenue = await this.bookingDal.totalRevenue();

      return totalRevenue;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `total revenue`),
      );
    }
  }

  async topThreeClientsWhoHaveSpentMore() {
    try {
      const clients = await this.bookingDal.topThreeClientsWhoHaveSpendMore();

      return clients;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(
          `get`,
          `top 3 clients who have spent more`,
        ),
      );
    }
  }
  async topThreeClientsWhoHaveBookedMore() {
    try {
      const clients = await this.bookingDal.topThreeClientsWhoHaveBookedMore();

      return clients;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(
          `get`,
          `top 3 clients who have booked more`,
        ),
      );
    }
  }
}
