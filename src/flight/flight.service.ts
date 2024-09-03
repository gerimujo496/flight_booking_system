import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { AirplaneService } from 'src/airplane/airplane.service';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { FlightDal } from './flight.dal';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { User } from 'src/user/entities/user.entity';
import { BookingSeatHelper } from 'src/booking-seat/booking-seat.helper';
import { FlightHelper } from './flight.helper';

@Injectable()
export class FlightService {
  constructor(
    private airplaneService: AirplaneService,
    private flightDal: FlightDal,
    private bookingSeatHelper: BookingSeatHelper,
    private flightHelper: FlightHelper,
  ) {}

  async create(createFlightDto: CreateFlightDto) {
    try {
      const { departure_time, arrival_time, airplane_id } = createFlightDto;

      await this.bookingSeatHelper.getAirplaneOrThrowError(airplane_id);

      const isAirplaneFreeAtThisTime =
        await this.airplaneService.isFreeAtThisTime(
          airplane_id,
          departure_time,
          arrival_time,
        );

      if (!isAirplaneFreeAtThisTime)
        throw new ConflictException(
          errorMessage.PLANE_NOT_AVAILABLE(airplane_id, departure_time),
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
        errorMessage.INTERNAL_SERVER_ERROR(`creating`, `flight`),
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
        errorMessage.INTERNAL_SERVER_ERROR(`get`, 'all flights'),
      );
    }
  }

  async findOneById(id: number) {
    try {
      const flight = this.bookingSeatHelper.getFlightOrThrowError(id);

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

  async update(id: number, updateFlightDto: UpdateFlightDto) {
    try {
      const updateResult = await this.flightDal.update(id, updateFlightDto);
      if (!updateResult.affected)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`flight`, `id`, `${id}`),
        );

      const flight = await this.flightDal.findOneById(id);

      return flight;
    } catch (error) {
      if (error instanceof NotFoundException)
        return throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, 'flight'),
      );
    }
  }

  async upcomingFlights() {
    try {
      const flights = await this.flightDal.upcomingFlights();

      return flights;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, 'upcoming flights'),
      );
    }
  }

  async filter(filter: FilterFlightDto, user: User) {
    try {
      const { departure_time, departure_country, arrival_country } = filter;

      const newFilter = {
        departure_time,
        arrival_country,
        departure_country: departure_country || user.country,
      } as FilterFlightDto;

      const flights = await this.flightDal.filter(newFilter);

      return flights;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`filter`, 'flight'),
      );
    }
  }
  async remove(id: number) {
    try {
      const flight = await this.bookingSeatHelper.getFlightOrThrowError(id);
      await this.flightHelper.rejectAllBookingsAndReturnCredits(flight);

      await this.flightDal.removeFlight(flight.id);

      flight.is_active = false;

      return flight;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async getNumberOfFlights() {
    try {
      const number = await this.flightDal.getNumberOfFlights();

      return { count: number };
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `count of total flights`),
      );
    }
  }
}
