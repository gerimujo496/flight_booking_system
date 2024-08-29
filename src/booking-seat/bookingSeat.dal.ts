import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';

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
      where: { seatNumber, flightId, airplaneId },
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
      .getMany();

    return seats;
  }
}
