import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { SignInDto } from './dto/signIn-user.dto';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/helpers/throwError';
import { UserDal } from './user.dal';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private usersDal: UserDal,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      const user = await this.usersDal.findByEmail(email);

      if (user) {
        throw new UnprocessableEntityException(
          errorMessage.EMAIL_IN_USE(email),
        );
      }
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');

      const registerUser: CreateUserDto = {
        ...createUserDto,
        password: result,
      };
      const registeredUser = await this.usersService.createUser(registerUser);

      return registeredUser;
    } catch (error) {
      if (error instanceof UnprocessableEntityException)
        throwError(HttpStatus.UNPROCESSABLE_ENTITY, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`create`, `user`),
      );
    }
  }

  async signIn(userSignIn: SignInDto) {
    try {
      const { email, password } = userSignIn;
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException(errorMessage.INVALID_CREDENTIALS);
      }

      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex')) {
        throw new UnauthorizedException(errorMessage.INVALID_CREDENTIALS);
      }

      return this.usersService.findByIdJoinWithCredits(user.id);
    } catch (error) {
      if (error instanceof UnauthorizedException)
        throwError(HttpStatus.UNAUTHORIZED, error.message);

      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`login`, `user`),
      );
    }
  }
}
