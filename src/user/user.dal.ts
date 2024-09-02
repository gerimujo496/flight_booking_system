import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Credit } from 'src/credit/entities/credit.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserDal {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    const user: User = await this.userRepo.findOne({
      where: { email, is_active: true },
    });

    return user;
  }

  async create(createUser: CreateUserDto) {
    const newUser = this.userRepo.create(createUser);
    const createdUser = await this.userRepo.save(newUser);

    return createdUser;
  }

  async findByIdJoinWithCredits(id: number) {
    const user = await this.dataSource
      .getRepository(Credit)
      .createQueryBuilder('credit')
      .leftJoinAndSelect('credit.user_id', 'user')
      .where('credit.user_id = :id', { id })
      .andWhere('user.is_active = true')
      .getOne();

    return user;
  }

  async findOneById(id: number) {
    const user = await this.dataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :id', { id })
      .andWhere('is_active = true')
      .getOne();

    return user;
  }

  async findAll() {
    const users = await this.dataSource
      .getRepository(Credit)
      .createQueryBuilder('credit')
      .leftJoinAndSelect('credit.user_id', 'user')
      .where('user.is_active = true')
      .getMany();

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const results = await this.userRepo.update(
      { id: id, is_active: true },
      updateUserDto,
    );

    return results;
  }

  async remove(id: number) {
    const results = await this.userRepo.update(
      { id: id, is_active: true },
      { is_active: false },
    );

    return results;
  }

  async passengerNumber() {
    const passengerNumber = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.is_active = true')
      .andWhere('user.isAdmin = false')
      .getCount();

    return passengerNumber;
  }
}
