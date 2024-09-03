import {
  Controller,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreditService } from './credit.service';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { AdminOrEntityOwnerGuard } from 'src/guards/adminOrEntityOwner.guard';
import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller(controller.CREDIT)
@UseGuards(AdminOrEntityOwnerGuard)
@UseInterceptors(new SerializerInterceptor(UserDto))
@ApiTags(controller.CREDIT)
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Patch(controller_path.CREDIT.REMOVE_CREDITS)
  async removeCredits(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreditDto: UpdateCreditDto,
  ) {
    return await this.creditService.removeCredits(id, updateCreditDto.credits);
  }

  @Patch(controller_path.CREDIT.ADD_CREDITS)
  async addCredits(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreditDto: UpdateCreditDto,
  ) {
    return await this.creditService.addCredits(id, updateCreditDto.credits);
  }

  @Patch(controller_path.CREDIT.SET_VALUE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreditDto: UpdateCreditDto,
  ) {
    return await this.creditService.update(id, updateCreditDto);
  }
}
