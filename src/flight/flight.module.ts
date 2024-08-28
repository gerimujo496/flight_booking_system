import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from 'src/airplane/entities/airplane.entity';
import { Flight } from './entities/flight.entity';
import { AirplaneModule } from 'src/airplane/airplane.module';

@Module({
  imports: [TypeOrmModule.forFeature([Airplane, Flight]), AirplaneModule],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
