import { Module, forwardRef } from '@nestjs/common';
import { BookingSeatService } from './booking-seat.service';
import { BookingSeatController } from './booking-seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSeat } from './entities/booking-seat.entity';
import { FlightModule } from 'src/flight/flight.module';
import { AirplaneModule } from 'src/airplane/airplane.module';
import { BookingSeatDal } from './bookingSeat.dal';
import { BookingSeatHelper } from './booking-seat.helper';
import { CreditModule } from 'src/credit/credit.module';
import { UserModule } from 'src/user/user.module';
import { HelpersModule } from 'src/helpers/helpers.module';
import { Flight } from 'src/flight/entities/flight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingSeat, Flight]),
    forwardRef(() => FlightModule),
    forwardRef(() => AirplaneModule),
    forwardRef(() => CreditModule),
    forwardRef(() => UserModule),
    forwardRef(() => HelpersModule),
  ],
  controllers: [BookingSeatController],
  providers: [BookingSeatService, BookingSeatDal, BookingSeatHelper],
  exports: [BookingSeatDal, BookingSeatHelper, BookingSeatService],
})
export class BookingSeatModule {}
