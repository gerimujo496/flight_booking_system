import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { UserDto } from './dto/user.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AdminOrEntityOwnerGuard } from 'src/guards/adminOrEntityOwner.guard';
import { controller_path } from 'src/constants/controllerPath';
import { controller } from 'src/constants/controller';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@ApiTags(controller.USER)
@Controller(controller.USER)
@UseGuards(AdminOrEntityOwnerGuard)
@UseInterceptors(new SerializerInterceptor(UserDto))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(controller_path.USER.GET_ALL)
  @UseGuards(AdminGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(controller_path.USER.GET_ONE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findByIdJoinWithCredits(id);
  }

  @Patch(controller_path.USER.PATCH_ONE)
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(controller_path.USER.DELETE_ONE)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
