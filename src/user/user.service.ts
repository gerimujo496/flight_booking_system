import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreditService } from 'src/credit/credit.service';
import { Credit } from 'src/credit/entities/credit.entity';
import { error } from 'src/constants/errorMessages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private creditService: CreditService,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    const user: User = await this.userRepo.findOne({ where: { email } });

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password, country, credits } =
      createUserDto;

    const newUser = this.userRepo.create({
      firstName,
      lastName,
      email,
      password,
      country,
    });

    const createdUser = await this.userRepo.save(newUser);
    await this.creditService.create({
      userId: createdUser,
      credits,
    });
    return this.findOne(createdUser.id);
  }

  async findAll() {
    const users = await this.dataSource
      .getRepository(Credit)
      .createQueryBuilder('credit')
      .leftJoinAndSelect('credit.userId', 'user')
      .getMany();

    return users;
  }

  async findOne(id: number) {
    const user = await this.dataSource
      .getRepository(Credit)
      .createQueryBuilder('credit')
      .leftJoinAndSelect('credit.userId', 'user')
      .where('credit.userId = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException(error.NOT_FOUND('user'));
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateResult = await this.userRepo.update(id, updateUserDto);
    if (!updateResult.affected) {
      throw new NotFoundException(`The user not found`);
    }

    const updatedUser = await this.findOne(id);

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(error.NOT_FOUND('user'));
    }
    const returnedObject = await this.findOne(id);
    await this.userRepo.remove(user);

    return returnedObject;
  }
}
