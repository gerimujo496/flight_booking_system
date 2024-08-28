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
    const user: User = await this.userRepo.findOne({ where: { email } });

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
      .leftJoinAndSelect('credit.userId', 'user')
      .where('credit.userId = :id', { id })
      .getOne();

    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    return user;
  }

  async findAll() {
    const users = await this.dataSource
      .getRepository(Credit)
      .createQueryBuilder('credit')
      .leftJoinAndSelect('credit.userId', 'user')
      .getMany();

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateResult = await this.userRepo.update(id, updateUserDto);

    return updateResult;
  }

  async remove(user: User) {
    const removedUser = await this.userRepo.remove(user);

    return removedUser;
  }
}
