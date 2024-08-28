import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { UserDal } from './user.dal';
import { CreditDal } from 'src/credit/credit.dal';

@Injectable()
export class UserService {
  constructor(
    private userDal: UserDal,
    private creditDal: CreditDal,
  ) {}

  async findByEmail(email: string) {
    try {
      const user: User = await this.userDal.findByEmail(email);
      if (!user) throw new NotFoundException(errorMessage.NOT_FOUND(`user`));

      return user;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

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

      const createdUser = await this.userDal.create({
        firstName,
        lastName,
        email,
        password,
        country,
      } as CreateUserDto);

      await this.creditDal.create({
        userId: createdUser,
        credits,
      });

      return this.userDal.findByIdJoinWithCredits(createdUser.id);
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `user`),
      );
    }
  }

  async findAll() {
    try {
      const users = await this.userDal.findAll();

      return users;
    } catch (error) {
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`get`, `users`),
      );
    }
  }

  async findByIdJoinWithCredits(id: number) {
    try {
      const user = await this.userDal.findByIdJoinWithCredits(id);

      if (!user) {
        throw new NotFoundException(errorMessage.NOT_FOUND(`user`));
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`find`, `user`),
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateResult = await this.userDal.update(id, updateUserDto);
      if (!updateResult.affected) {
        throw new NotFoundException(`The user not found`);
      }

      const updatedUser = await this.userDal.findByIdJoinWithCredits(id);

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`update`, `user`),
      );
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userDal.findOneById(id);
      if (!user) {
        throw new NotFoundException(errorMessage.NOT_FOUND('user'));
      }
      const userObjectJoinedWithCredits =
        await this.userDal.findByIdJoinWithCredits(id);
      await this.userDal.remove(user);

      return userObjectJoinedWithCredits;
    } catch (error) {
      if (error instanceof NotFoundException)
        throwError(HttpStatus.NOT_FOUND, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`remove`, `user`),
      );
    }
  }
}
