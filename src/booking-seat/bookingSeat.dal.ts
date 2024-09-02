import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { Credit } from 'src/credit/entities/credit.entity';
import { query } from 'src/constants/query';

@Injectable()
export class BookingSeatDal {
  constructor(
    @InjectRepository(BookingSeat)
    private bookingSeatRepo: Repository<BookingSeat>,
    private dataSource: DataSource,
  ) {}

  async create(createBookingSeatDto: CreateBookingSeatDto) {
    const booking = this.bookingSeatRepo.create(createBookingSeatDto);
    const savedBooking = await this.bookingSeatRepo.save(booking);

    return savedBooking;
  }

  async isSeatFree(
    seat_number: number,
    flight_id: number,
    airplane_id: number,
  ) {
    const booking = await this.bookingSeatRepo.findOne({
      where: { seat_number, flight_id, airplane_id, is_approved: true },
    });

    if (booking) return false;

    return true;
  }

  async getTakenSeats(flightId: number) {
    const seats = await this.dataSource
      .createQueryBuilder()
      .select('booking_seat.seat_number')
      .from(BookingSeat, 'booking_seat')
      .where(
        '(booking_seat.flight_id = :flightId OR booking_seat.return_flight_id = :flightId) AND booking_seat.is_approved = true',
        { flightId },
      )
      .getMany();

    return seats;
  }

  async findAllJoinColumns() {
    const allBookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .leftJoinAndSelect('booking_seat.airplane_id', 'airplane')
      .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .leftJoinAndSelect('booking_seat.return_flight_id', 'return_flight')
      .where('flight.is_active = true')
      .getMany();

    return allBookings;
  }

  async findOneByIdJoinColumns(id: number) {
    const booking = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .leftJoinAndSelect('booking_seat.airplane_id', 'airplane')
      .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .leftJoinAndSelect('booking_seat.return_flight_id', 'return_flight')
      .where('booking_seat.id = :id', { id })
      .andWhere('flight.is_active = true')
      .getOne();

    return booking;
  }
  async getBookingWithSameSeatNumber(
    booking_id: number,
    flight_id: number,
    seat_number: number,
  ) {
    const bookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'credit')
      .where('booking_seat.seat_number = :seat_number', { seat_number })
      .andWhere('booking_seat.flightIdId = :flight_id', { flight_id })
      .andWhere('booking_seat.id != :booking_id', { booking_id })
      .getMany();

    return bookings;
  }

  async approveBooking(id: number) {
    const approvedBooking = await this.dataSource
      .createQueryBuilder()
      .update(BookingSeat)
      .set({ is_approved: true })
      .where('booking_seat.id = :id', { id })
      .execute();

    return approvedBooking;
  }

  async rejectBookingsWithSameSeatNumber(
    booking_id: number,
    flight_id: number,
    seat_number: number,
  ) {
    const bookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .leftJoinAndSelect('booking_seat.airplane_id', 'airplane')
      .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .update(BookingSeat)
      .set({ is_approved: false })
      .where(`seat_number = :seat_number`, { seat_number })
      .andWhere('flight_id = :flight_id', { flight_id })
      .andWhere('id != :booking_id', { booking_id })
      .execute();

    return bookings;
  }

  async rejectBooking(id: number) {
    const updateResults = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      //   .leftJoinAndSelect('booking_seat.user_id', 'user')
      //   .leftJoinAndSelect('booking_seat.airplane_id', 'airplane')
      //   .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .update(BookingSeat)
      .set({ is_approved: false })
      .where(`id = :id`, { id })
      .execute();

    return updateResults;
  }

  async returnCreditsToRejectedBookingsUsers(
    userIdsAndPrice: { userId: number; price: number }[],
  ) {
    for (const item of userIdsAndPrice) {
      await this.dataSource
        .createQueryBuilder()
        .update(Credit)
        .set({ credits: () => `credits + ${item.price}` })
        .where('user_id = :id', { id: item.userId })
        .execute();
    }
  }

  async getUserBookingHistory(userId: number) {
    const booking = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .leftJoinAndSelect('booking_seat.airplane_id', 'airplane')
      .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .where('booking_seat.user_id = :userId', { userId })
      .andWhere('flight.arrival_time <= :date', { date: new Date() })
      .andWhere('booking_seat.is_approved = true')
      .getMany();

    return booking;
  }

  async getBookingsRelatedToFlight(flightId: number) {
    const bookings = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .leftJoinAndSelect('booking_seat.airplane_id', 'airplane')
      .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .where('booking_seat.flight_id = :flightId', { flightId })
      .getMany();

    return bookings;
  }

  async rejectBookingsRelatedToFlight(flightId: number) {
    const updateResults = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .update(BookingSeat)
      .set({ is_approved: false })
      .where(`flight_id = :flightId`, { flightId })
      .execute();

    return updateResults;
  }

  async totalRevenue() {
    const totalRevenue = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.flight_id', 'flight')
      .select('COALESCE(SUM(booking_seat.price), 0)', 'sum')
      .where('flight.is_active = true')
      .andWhere('booking_seat.is_approved = true')
      .getRawOne();

    return totalRevenue;
  }

  async topThreeClientsWhoHaveSpendMore() {
    const clients = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .select('user.id', 'id')
      .addSelect('user.first_name', 'first_name')
      .addSelect('user.last_name', 'last_name')
      .addSelect('SUM(booking_seat.price)', 'total_spent')
      .groupBy('user.id')
      .addGroupBy('user.first_name')
      .addGroupBy('user.last_name')
      .addGroupBy('booking_seat.is_approved')
      .having('booking_seat.is_approved = true')
      .orderBy('total_spent', 'DESC')
      .limit(3)
      .getRawMany();

    return clients;
  }

  async topThreeClientsWhoHaveBookedMore() {
    const clients = await this.dataSource
      .getRepository(BookingSeat)
      .createQueryBuilder('booking_seat')
      .leftJoinAndSelect('booking_seat.user_id', 'user')
      .select('user.id', 'id')
      .addSelect('user.first_name', 'first_name')
      .addSelect('user.last_name', 'last_name')
      .addSelect('COUNT(*)', 'booking_number')
      .groupBy('user.id')
      .addGroupBy('user.first_name')
      .addGroupBy('user.last_name')
      .addGroupBy('booking_seat.is_approved')
      .having('booking_seat.is_approved = true')
      .orderBy('booking_number', 'DESC')
      .limit(3)
      .getRawMany();

    return clients;
  }
}
