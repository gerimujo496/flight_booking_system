import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreditService } from 'src/credit/credit.service';
import { Credit } from 'src/credit/entities/credit.entity';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/constants/throwError';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private creditService: CreditService,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    try {
      const user: User = await this.userRepo.findOne({ where: { email } });
      if (!user) throw new NotFoundException(errorMessage.NOT_FOUND(`user`));

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `user`),
      );
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
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
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `user`),
      );
    }
  }

  async findAll() {
    try {
      const users = await this.dataSource
        .getRepository(Credit)
        .createQueryBuilder('credit')
        .leftJoinAndSelect('credit.userId', 'user')
        .getMany();

      return users;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `users`),
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.dataSource
        .getRepository(Credit)
        .createQueryBuilder('credit')
        .leftJoinAndSelect('credit.userId', 'user')
        .where('credit.userId = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException(errorMessage.NOT_FOUND(`user`));
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `user`),
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateResult = await this.userRepo.update(id, updateUserDto);
      if (!updateResult.affected) {
        throw new NotFoundException(`The user not found`);
      }

      const updatedUser = await this.findOne(id);

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, `user`),
      );
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(errorMessage.NOT_FOUND('user'));
      }
      const returnedObject = await this.findOne(id);
      await this.userRepo.remove(user);

      return returnedObject;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throwError(HttpStatus.NOT_FOUND, error.message);
      }

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`remove`, `user`),
      );
    }
  }
}
