import { Module } from '@nestjs/common';
import { AirplaneService } from './airplane.service';
import { AirplaneController } from './airplane.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airplane } from './entities/airplane.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airplane])],
  controllers: [AirplaneController],
  providers: [AirplaneService],
})
export class AirplaneModule {}
