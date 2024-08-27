import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignInDto } from './dto/signIn-user.dto';
import { error } from 'src/constants/errorMessages';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const user = await this.usersService.findByEmail(email);

    if (user) {
      throw new BadRequestException(`Email: ${email} is in use !`);
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const registerUser: CreateUserDto = { ...createUserDto, password: result };
    const registeredUser = await this.usersService.createUser(registerUser);

    return registeredUser;
  }

  async signIn(userSignIn: SignInDto) {
    const { email, password } = userSignIn;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(error.NOT_FOUND('user'));
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return this.usersService.findOne(user.id);
  }
}
