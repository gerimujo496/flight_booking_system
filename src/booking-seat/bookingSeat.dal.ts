import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { Credit } from 'src/credit/entities/credit.entity';

@Injectable()
export class BookingSeatDal {
  constructor(
    @InjectRepository(BookingSeat)
    private bookingSeatRepo: Repository<BookingSeat>,
    private dataSource: DataSource,
  ) {}

  async create(createBookingSeatDto: CreateBookingSeatDto) {
    const booking = this.bookingSeatRepo.create(createBookingSeatDto);
    const savedBooking = this.bookingSeatRepo.save(booking);

    return savedBooking;
  }

  async isSeatFree(seatNumber: number, flightId: number, airplaneId: number) {
    const booking = await this.bookingSeatRepo.findOne({
      where: { seatNumber, flightId, airplaneId, isApproved: true },
    });

    if (booking) return false;

    return true;
  }

  async getTakenSeats(flightId: number) {
    const seats = await this.dataSource
      .createQueryBuilder()
      .select('booking_seat.seatNumber')
      .from(BookingSeat, 'booking_seat')
      .where('booking_seat.flightId = :flightId', { flightId })
      .andWhere('booking.isApproved = true')
      .getMany();

    return seats;
  }

  async findAllJoinColumns() {
    const allBookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.userId', 'user')
      .leftJoinAndSelect('booking_seat.airplaneId', 'airplane')
      .leftJoinAndSelect('booking_seat.flightId', 'flight')
      .getMany();

    return allBookings;
  }

  async findOneByIdJoinColumns(id: number) {
    const booking = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.userId', 'user')
      .leftJoinAndSelect('booking_seat.airplaneId', 'airplane')
      .leftJoinAndSelect('booking_seat.flightId', 'flight')
      .where('booking_seat.id = :id', { id })
      .getOne();

    return booking;
  }
  async getBookingWithSameSeatNumber(
    bookingId: number,
    flightId: number,
    seatNumber: number,
  ) {
    const bookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.userId', 'user')
      .leftJoinAndSelect('booking_seat.airplaneId', 'airplane')
      .leftJoinAndSelect('booking_seat.flightId', 'flight')
      .where('booking_seat.seatNumber = :seatNumber', { seatNumber })
      .andWhere('booking_seat.flightId = :flightId', { flightId })
      .andWhere('booking_seat.id != :bookingId', { bookingId })
      .execute();

    return bookings;
  }

  async approveBooking(id: number) {
    const approvedBooking = await this.dataSource
      .createQueryBuilder()
      .update(BookingSeat)
      .set({ isApproved: true })
      .where('booking_seat.id = :id', { id })
      .execute();
    console.log('app', approvedBooking);
    return approvedBooking;
  }

  async rejectBookingsAndReturnCredits(
    bookingId: number,
    flightId: number,
    seatNumber: number,
  ) {
    const bookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .update(BookingSeat)
      .set({ isApproved: false })
      .where(`booking_seat.${'seatNumber'} = :seatNumber`, { seatNumber })
      //   .andWhere('booking_seat.flightId = :flightId', { flightId })
      .andWhere('booking_seat.id != :bookingId', { bookingId })
      .execute();
    console.log('reject', bookings);
    return bookings;
  }
}
