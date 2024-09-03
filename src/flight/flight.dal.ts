import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Flight } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { Country } from 'src/types/country';

@Injectable()
export class FlightDal {
  constructor(
    @InjectRepository(Flight) private flightRepo: Repository<Flight>,
    private dataSource: DataSource,
  ) {}

  async create(createFlightDto: CreateFlightDto) {
    const flight = await this.flightRepo.create(createFlightDto);
    const createdFlight = await this.flightRepo.save(flight);

    return createdFlight;
  }

  async findAll() {
    const fights = await this.flightRepo.find({});

    return fights;
  }

  async findOneById(id: number) {
    const flight = await this.dataSource
      .getRepository(Flight)
      .createQueryBuilder('flight')
      .leftJoinAndSelect('flight.airplane_id', 'airplane')
      .where('flight.id = :id', { id: id })
      .andWhere('flight.is_active = true')
      .getOne();

    return flight;
  }

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    const result = await this.flightRepo.update(id, updateFlightDto);

    return result;
  }

  async upcomingFlights() {
    const upcomingFlights = this.dataSource
      .createQueryBuilder()
      .select('flight')
      .from(Flight, 'flight')
      .where('flight.departure_time >= :departure_time', {
        departure_time: new Date(),
      })
      .andWhere('flight.is_active = true')
      .getMany();

    return upcomingFlights;
  }

  async filter(filter: FilterFlightDto) {
    const { departure_time, departure_country, arrival_country } = filter;
    const query = this.dataSource
      .createQueryBuilder()
      .select('flight')
      .from(Flight, 'flight')
      .where('is_active = true');

    if (departure_time) {
      query.andWhere('departure_time = :departure_time', {
        departure_time,
      });
    }

    if (departure_country != Country.UNKNOWN) {
      query.andWhere('flight.departure_country = :departure_country', {
        departure_country,
      });
    }

    if (arrival_country) {
      query.andWhere('flight.arrival_country = :arrival_country', {
        arrival_country,
      });
    }

    return await query.getMany();
  }

  async removeFlight(id: number) {
    const deleteResult = await this.flightRepo.update(id, { is_active: false });

    return deleteResult;
  }
  async getNumberOfFlights() {
    const number = await this.dataSource
      .getRepository(Flight)
      .createQueryBuilder('flight')
      .where('flight.is_active = true')
      .getCount();

    return number;
  }
}
