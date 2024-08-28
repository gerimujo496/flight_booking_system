import { Module } from '@nestjs/common';
import { BookingSeatService } from './booking-seat.service';
import { BookingSeatController } from './booking-seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSeat } from './entities/booking-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingSeat])],
  controllers: [BookingSeatController],
  providers: [BookingSeatService],
})
export class BookingSeatModule {}
