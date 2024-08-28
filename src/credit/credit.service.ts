import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { CreditDal } from './credit.dal';

@Injectable()
export class CreditService {
  constructor(private creditDal: CreditDal) {}

  async create(createCreditDto: CreateCreditDto) {
    try {
      const createdCredit = await this.creditDal.create(createCreditDto);

      return createdCredit;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `credit`),
      );
    }
  }

  async findOneById(id: number) {
    try {
      const credit = await this.creditDal.findOneById(id);
      if (!credit)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
        );

      return credit;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `credit`),
      );
    }
  }

  async removeCredits(id: number, value: number) {
    try {
      const credit = await this.creditDal.findOneById(id);
      if (!credit)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
        );

      if (credit.credits < value)
        throw new ForbiddenException(errorMessage.BALANCE_NOT_ENOUGH);

      const updateBody: UpdateCreditDto = { credits: value - credit.credits };

      return await this.update(id, updateBody);
    } catch (error) {
      if (error instanceof ForbiddenException)
        throwError(HttpStatus.FORBIDDEN, error.message);

      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `credit`),
      );
    }
  }

  async addCredits(id: number, value: number) {
    try {
      const credit = await this.creditDal.findOneById(id);
      if (!credit)
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
        );

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
      const updateResult = await this.creditDal.update(id, updateCreditDto);

      if (!updateResult.affected) {
        throw new NotFoundException(
          errorMessage.NOT_FOUND(`credit`, `id`, `${id}`),
        );
      }

      return await this.findOneById(id);
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, `credits`),
      );
    }
  }
}
