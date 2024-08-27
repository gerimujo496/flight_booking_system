import {
  Body,
  Controller,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { UserDto } from './dto/user.dto';
import { SignInDto } from './dto/signIn-user.dto';

@Controller('auth')
@UseInterceptors(new SerializerInterceptor(UserDto))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/signIn')
  async signIn(@Body() signInUser: SignInDto, @Session() session: any) {
    const user = await this.authService.signIn(signInUser);
    session.userId = user.id;

    return user;
  }

  @Post('/signOut')
  async signOut(@Session() session: any) {
    session.userId = null;

    return;
  }
}
