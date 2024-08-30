import { Module, forwardRef } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Flight } from './entities/flight.entity';
import { AirplaneModule } from 'src/airplane/airplane.module';
import { FlightDal } from './flight.dal';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { BookingSeatModule } from 'src/booking-seat/booking-seat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airplane, Flight]),
    AirplaneModule,
    forwardRef(() => BookingSeatModule),
  ],
  controllers: [FlightController],
  providers: [FlightService, FlightDal, ExecutionContextHost],
  exports: [FlightDal],
})
export class FlightModule {}
