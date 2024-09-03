import { Module } from '@nestjs/common';
import { AirplaneService } from './airplane.service';
import { AirplaneController } from './airplane.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from './entities/airplane.entity';
import { Flight } from 'src/flight/entities/flight.entity';
import { AirplaneDal } from './airplane.dal';

@Module({
  imports: [TypeOrmModule.forFeature([Airplane, Flight])],
  controllers: [AirplaneController],
  providers: [AirplaneService, AirplaneDal],
  exports: [AirplaneService, AirplaneDal],
})
export class AirplaneModule {}
