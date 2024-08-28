import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { AirplaneService } from 'src/airplane/airplane.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { DataSource, Repository } from 'typeorm';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { AirplaneDal } from 'src/airplane/airplane.dal';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Flight) private flightRepo: Repository<Flight>,
    private airplaneService: AirplaneService,
    private dataSource: DataSource,
    private airplaneDal: AirplaneDal,
  ) {}

  async create(createFlightDto: CreateFlightDto) {
    try {
      const {
        departureCountry,
        departureAirport,
        departureTime,
        arrivalCountry,
        arrivalAirport,
        arrivalTime,
        airplaneId,
        price,
      } = createFlightDto;

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

      const flight = this.flightRepo.create({
        departureCountry,
        departureAirport,
        departureTime,
        arrivalCountry,
        arrivalAirport,
        arrivalTime,
        airplaneId,
        price,
      });

      const createdFlight = await this.flightRepo.save(flight);

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

  findAll() {
    return `This action returns all flight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flight`;
  }

  update(id: number, updateFlightDto: UpdateFlightDto) {
    return `This action updates a #${id} flight`;
  }

  remove(id: number) {
    return `This action removes a #${id} flight`;
  }
}
