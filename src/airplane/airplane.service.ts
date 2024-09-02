import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { throwError } from 'src/helpers/throwError';
import { errorMessage } from 'src/constants/errorMessages';
import { AirplaneDal } from './airplane.dal';
import { FilterAirplaneDto } from './dto/filter-airplane.dto';

@Injectable()
export class AirplaneService {
  constructor(private airplaneDal: AirplaneDal) {}

  async create(createAirplaneDto: CreateAirplaneDto) {
    try {
      const createdAirplane = this.airplaneDal.create(createAirplaneDto);

      return createdAirplane;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `airplane`),
      );
    }
  }

  async findAll() {
    try {
      const airplanes = await this.airplaneDal.findAll();

      return airplanes;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `airplanes`),
      );
    }
  }

  async findOneById(id: number) {
    try {
      const airplane = await this.airplaneDal.findOneById(id);

      if (!airplane)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`airplane`, `id`, `${id}`),
        );

      return airplane;
    } catch (error) {
      if (error instanceof NotFoundException)
        return throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `airplane`),
      );
    }
  }

  async update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    try {
      const updateResult = await this.airplaneDal.update(id, updateAirplaneDto);

      if (!updateResult.affected)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`airplane`, `id`, `${id}`),
        );

      const updatedAirplane = await this.findOneById(id);

      return updatedAirplane;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, `airplane`),
      );
    }
  }

  async remove(id: number) {
    try {
      const airplane = await this.airplaneDal.findOneById(id);
      if (!airplane)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`airplane`, `id`, `${id}`),
        );
      await this.airplaneDal.remove(id);
      airplane.is_active = false;
      return airplane;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`delete`, `airplane`),
      );
    }
  }

  async isFreeAtThisTime(id: number, departureTime: Date, arrivalTime: Date) {
    const existingFlight = await this.airplaneDal.checkConflictWithTheGivenTime(
      id,
      departureTime,
      arrivalTime,
    );

    if (!existingFlight.length) return true;

    return false;
  }

  async filterAirplanes(filter: FilterAirplaneDto) {
    try {
      const availableAirplanes =
        await this.airplaneDal.filterFreeAirplanes(filter);

      return availableAirplanes;
    } catch (error) {
      throwError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
