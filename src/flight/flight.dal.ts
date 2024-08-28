import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { DataSource, Repository } from 'typeorm';
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
    const flight = await this.flightRepo.find({ where: { id } });

    return flight;
  }

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    const result = await this.flightRepo.update(id, updateFlightDto);

    return result;
  }

  async upcomingFlights() {
    const upcomingFlights = await this.dataSource
      .createQueryBuilder()
      .select('flight')
      .from(Flight, 'flight')
      .where('flight.departureTime > :departureTime', {
        departureTime: new Date(),
      })
      .execute();

    return upcomingFlights;
  }

  async filter(filter: FilterFlightDto) {
    const { departureTime, departureCountry, arrivalCountry } = filter;

    const query = this.dataSource
      .createQueryBuilder()
      .select('flight')
      .from(Flight, 'flight');

    if (departureTime) {
      query.andWhere('flight.departureTime = :departureTime', {
        departureTime,
      });
    }

    if (departureCountry !== Country.UNKNOWN) {
      query.andWhere('flight.departureCountry = :departureCountry', {
        departureCountry,
      });
    }

    if (arrivalCountry) {
      query.andWhere('flight.arrivalCountry = :arrivalCountry', {
        arrivalCountry,
      });
    }

    return query.execute();
  }
}
