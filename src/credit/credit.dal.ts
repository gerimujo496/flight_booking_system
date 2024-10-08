import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCreditDto } from './dto/create-credit.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';

@Injectable()
export class CreditDal {
  constructor(
    @InjectRepository(Credit) private creditRepo: Repository<Credit>,
    private dataSource: DataSource,
  ) {}

  async create(createCreditDto: CreateCreditDto) {
    const newCredit = await this.creditRepo.create(createCreditDto);
    const createdCredit = await this.creditRepo.save(newCredit);

    return createdCredit;
  }

  async findOneById(id: number) {
    const credit = await this.creditRepo.findOne({ where: { id } });

    return credit;
  }

  async findOneByUserId(id: number) {
    const credit = await this.dataSource
      .createQueryBuilder()
      .select('credit')
      .from(Credit, 'credit')
      .where('credit.user_id = :id', { id })
      .getOne();

    return credit;
  }

  async update(id: number, updateCreditDto: UpdateCreditDto) {
    const updateResult = await this.creditRepo.update(id, updateCreditDto);

    return updateResult;
  }
}
