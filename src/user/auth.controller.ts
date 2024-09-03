import {
  Body,
  Controller,
  Post,
  Session,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { UserDto } from './dto/user.dto';
import { SignInDto, SignInSchema } from './dto/signIn-user.dto';
import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@ApiTags(controller.AUTH)
@Controller(controller.AUTH)
@UseInterceptors(new SerializerInterceptor(UserDto))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(controller_path.AUTH.SIGN_UP)
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post(controller_path.AUTH.SIGN_IN)
  @UsePipes(new ZodValidationPipe(SignInSchema))
  async signIn(@Body() signInUser: SignInDto, @Session() session: any) {
    const user = await this.authService.signIn(signInUser);
    session.userId = user.id;

    return user;
  }

  @Post(controller_path.AUTH.SIGN_OUT)
  async signOut(@Session() session: any) {
    session.userId = null;

    return;
  }
}
