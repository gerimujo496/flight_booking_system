import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { AirplaneService } from 'src/airplane/airplane.service';
import { DataSource } from 'typeorm';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { AirplaneDal } from 'src/airplane/airplane.dal';
import { FlightDal } from './flight.dal';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FlightService {
  constructor(
    private airplaneService: AirplaneService,
    private dataSource: DataSource,
    private airplaneDal: AirplaneDal,
    private flightDal: FlightDal,
  ) {}

  async create(createFlightDto: CreateFlightDto) {
    try {
      const { departureTime, arrivalTime, airplaneId } = createFlightDto;

      const airplane = await this.airplaneDal.findOneById(airplaneId);
      if (!airplane)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`airplane`, `id`, `${airplaneId}`),
        );

      const isAirplaneFreeAtThisTime =
        await this.airplaneService.isFreeAtThisTime(
          airplaneId,
          departureTime,
          arrivalTime,
        );

      if (!isAirplaneFreeAtThisTime)
        throw new ConflictException(
          errorMessage.PLANE_NOT_AVAILABLE(airplaneId, departureTime),
        );

      const createdFlight = await this.flightDal.create(createFlightDto);

      return createdFlight;
    } catch (error) {
      if (error instanceof ConflictException)
        throwError(HttpStatus.CONFLICT, error.message);

      if (error instanceof NotFoundException)
        return throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, 'flight'),
      );
    }
  }

  async findAll() {
    try {
      const flights = await this.flightDal.findAll();

      return flights;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, 'flights'),
      );
    }
  }

  async findOneById(id: number) {
    try {
      const flight = await this.flightDal.findOneById(id);
      if (!flight) {
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`flight`, `id`, `${id}`),
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException)
        return throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, 'flight'),
      );
    }
  }

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    try {
      const updateResult = await this.flightDal.update(id, updateFlightDto);
      if (!updateResult.affected)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`flight`, `id`, `${id}`),
        );

      const flight = await this.airplaneDal.findOneById(id);

      return flight;
    } catch (error) {
      if (error instanceof NotFoundException)
        return throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, 'flight'),
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} flight`;
  }

  async upcomingFlights() {
    try {
      const flights = await this.flightDal.upcomingFlights();

      return flights;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, 'flight'),
      );
    }
  }

  async filter(filter: FilterFlightDto, user: User) {
    try {
      const { departureTime, departureCountry, arrivalCountry } = filter;

      const newFilter = {
        departureTime,
        arrivalCountry,
        departureCountry: departureCountry || user.country,
      } as FilterFlightDto;

      const flights = await this.flightDal.filter(newFilter);

      return flights;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`filter`, 'flights'),
      );
    }
  }
}
