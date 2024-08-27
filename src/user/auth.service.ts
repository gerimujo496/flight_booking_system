import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInDto } from './dto/signIn-user.dto';
import { errorMessage } from 'src/constants/errorMessages';
import { throwError } from 'src/constants/throwError';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      const user = await this.usersService.findByEmail(email);

      if (user) {
        throw new BadRequestException(errorMessage.EMAIL_IN_USE(email));
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
      if (error instanceof BadRequestException) {
        throwError(HttpStatus.BAD_REQUEST, error.message);
      }
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`creating`, `user`),
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

      return this.usersService.findOne(user.id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throwError(HttpStatus.UNAUTHORIZED, error.message);
      }
      throwError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage.INTERNAL_SERVER_ERROR(`logging`, `user`),
      );
    }
  }
}
