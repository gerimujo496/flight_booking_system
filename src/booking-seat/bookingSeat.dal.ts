import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingSeatDal {
  constructor(
    @InjectRepository(BookingSeat)
    private bookingSeatRepo: Repository<BookingSeat>,
  ) {}
}
