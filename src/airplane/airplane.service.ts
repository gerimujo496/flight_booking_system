import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Airplane } from './entities/airplane.entity';
import { Repository } from 'typeorm';
import { throwError } from 'src/constants/throwError';
import { errorMessage } from 'src/constants/errorMessages';

@Injectable()
export class AirplaneService {
  constructor(
    @InjectRepository(Airplane) private airplaneRepo: Repository<Airplane>,
  ) {}

  async create(createAirplaneDto: CreateAirplaneDto) {
    try {
      const airplane = this.airplaneRepo.create(createAirplaneDto);
      const createdAirplane = await this.airplaneRepo.save(airplane);

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
      const airplanes = await this.airplaneRepo.find({});

      return airplanes;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `airplanes`),
      );
    }
  }

  async findOne(id: number) {
    try {
      const airplane = await this.airplaneRepo.findOne({ where: { id } });
      if (!airplane)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`airplane`, `id`, `${id}`),
        );

      return airplane;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `airplane`),
      );
    }
  }

  async update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    try {
      const updateResult = await this.airplaneRepo.update(
        id,
        updateAirplaneDto,
      );

      if (!updateResult.affected)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`airplane`, `id`, `${id}`),
        );

      const updatedAirplane = await this.findOne(id);

      return updatedAirplane;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, `airplane`),
      );
    }
  }

  async remove(id: number) {
    try {
      const airplane = await this.findOne(id);
      const deletedAirplane = await this.airplaneRepo.delete(airplane);

      return deletedAirplane;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`delete`, `airplane`),
      );
    }
  }
}
