import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Airplane } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { Flight } from 'src/flight/entities/flight.entity';
import { FilterAirplaneDto } from './dto/filter-airplane.dto';

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
    const airplane = await this.airplaneRepo.findOne({
      where: { id, is_active: true },
    });

    return airplane;
  }

  async update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    const updateResult = await this.airplaneRepo.update(id, updateAirplaneDto);

    return updateResult;
  }

  async remove(id: number) {
    const results = await this.airplaneRepo.update(id, { is_active: false });

    return results;
  }

  async checkConflictWithTheGivenTime(
    id: number,
    departure_time: Date,
    arrival_time: Date,
  ) {
    const existingFlight = await this.dataSource
      .createQueryBuilder()
      .select(`flight`)
      .from(Flight, 'flight')
      .where(`flight.arrival_time > :departure_time `, {
        departure_time,
      })
      .andWhere(`flight.departure_time < :arrival_time`, {
        arrival_time,
      })
      .andWhere(`flight.airplane_id = :id`, { id })
      .execute();

    return existingFlight;
  }
  async filterFreeAirplanes(filter: FilterAirplaneDto) {
    const { departure_time, arrival_time } = filter;

    const availableAirplanes = await this.dataSource
      .getRepository(Airplane)
      .createQueryBuilder('airplane')
      .leftJoin('airplane.flights', 'flight')
      .andWhere(
        `flight.id IS NULL OR ((flight.departure_time > :arrival_time OR flight.arrival_time < :departure_time) AND flight.is_active = true)`,
        { departure_time, arrival_time },
      )
      .getMany();

    return availableAirplanes;
  }
}
