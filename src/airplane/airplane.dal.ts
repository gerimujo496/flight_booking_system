import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Airplane } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { Flight } from 'src/flight/entities/flight.entity';

@Injectable()
export class AirplaneDal {
  constructor(
    @InjectRepository(Airplane) private airplaneRepo: Repository<Airplane>,
    private dataSource: DataSource,
  ) {}

  async create(createAirplaneDto: CreateAirplaneDto) {
    const airplane = this.airplaneRepo.create(createAirplaneDto);
    const createdAirplane = await this.airplaneRepo.save(airplane);

    return createdAirplane;
  }

  async findAll() {
    const airplanes = await this.airplaneRepo.find({});

    return airplanes;
  }

  async findOneById(id: number) {
    const airplane = await this.airplaneRepo.findOne({ where: { id } });

    return airplane;
  }

  async update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    const updateResult = await this.airplaneRepo.update(id, updateAirplaneDto);

    return updateResult;
  }

  async remove(airplane: Airplane) {
    const deletedAirplane = await this.airplaneRepo.delete(airplane);

    return deletedAirplane;
  }

  async checkConflictWithTheGivenTime(
    id: number,
    departureTime: Date,
    arrivalTime: Date,
  ) {
    const existingFlight = await this.dataSource
      .createQueryBuilder()
      .select(`flight`)
      .from(Flight, 'flight')
      .where(`flight.arrivalTime > :departureTime `, {
        departureTime,
      })
      .andWhere(`flight.departureTime < :arrivalTime`, {
        arrivalTime,
      })
      .andWhere(`flight.airplaneId = :id`, { id })
      .execute();

    return existingFlight;
  }
}
