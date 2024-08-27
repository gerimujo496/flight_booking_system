import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { Repository } from 'typeorm';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/constants/throwError';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(Credit) private creditRepo: Repository<Credit>,
  ) {}

  async create(createCreditDto: CreateCreditDto) {
    try {
      const { userId, credits } = createCreditDto;
      const creditInstance = await this.creditRepo.create({ userId, credits });

      return await this.creditRepo.save(creditInstance);
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `credit`),
      );
    }
  }

  async findOne(id: number) {
    try {
      const credit = await this.creditRepo.findOne({ where: { id } });
      if (!credit)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
        );

      return credit;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `credit`),
      );
    }
  }

  async removeCredits(id: number, value: number) {
    try {
      const credit = await this.findOne(id);

      if (credit.credits < value)
        throw new ForbiddenException(errorMessage.BALANCE_NOT_ENOUGH);

      const updateBody: UpdateCreditDto = { credits: value - credit.credits };

      return await this.update(id, updateBody);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throwError(HttpStatus.FORBIDDEN, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `credit`),
      );
    }
  }

  async addCredits(id: number, value: number) {
    try {
      const credit = await this.findOne(id);

      const updateBody: UpdateCreditDto = { credits: value + credit.credits };

      return await this.update(id, updateBody);
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`add`, `credits`),
      );
    }
  }

  async update(id: number, updateCreditDto: UpdateCreditDto) {
    try {
      const updateResult = await this.creditRepo.update(id, updateCreditDto);

      if (!updateResult.affected) {
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
        );
      }

      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, `credits`),
      );
    }
  }
}
