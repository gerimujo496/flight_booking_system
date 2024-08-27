import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { Repository } from 'typeorm';
import { error } from 'src/constants/errorMessages';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(Credit) private creditRepo: Repository<Credit>,
  ) {}

  async create(createCreditDto: CreateCreditDto) {
    const { userId, credits } = createCreditDto;
    const creditInstance = await this.creditRepo.create({ userId, credits });

    return await this.creditRepo.save(creditInstance);
  }

  async findOne(id: number) {
    const credit = await this.creditRepo.findOne({ where: { id } });
    if (!credit)
      throw new NotFoundException(error.NOT_FOUND(`credit`, `id`, `${id}`));

    return credit;
  }

  async removeCredits(id: number, value: number) {
    const credit = await this.findOne(id);

    if (credit.credits < value)
      throw new ForbiddenException(error.BALANCE_NOT_ENOUGH);

    const updateBody: UpdateCreditDto = { credits: value - credit.credits };

    return await this.update(id, updateBody);
  }

  async addCredits(id: number, value: number) {
    const credit = await this.findOne(id);

    const updateBody: UpdateCreditDto = { credits: value + credit.credits };

    return await this.update(id, updateBody);
  }

  async update(id: number, updateCreditDto: UpdateCreditDto) {
    const updateResult = await this.creditRepo.update(id, updateCreditDto);

    if (!updateResult.affected) {
      throw new NotFoundException(error.NOT_FOUND(`credit`, `id`, `${id}`));
    }

    return await this.findOne(id);
  }
}
