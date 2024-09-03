import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { FlightModule } from 'src/flight/flight.module';
import { BookingSeatModule } from 'src/booking-seat/booking-seat.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [StatisticController],
  providers: [],
  imports: [FlightModule, BookingSeatModule, UserModule],
})
export class StatisticModule {}
