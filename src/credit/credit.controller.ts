import {
  Controller,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreditService } from './credit.service';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminOrEntityOwnerGuard } from 'src/guards/adminOrEntityOwner.guard';

@Controller('credit')
@UseGuards(AuthGuard)
@UseGuards(AdminOrEntityOwnerGuard)
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreditDto: UpdateCreditDto,
  ) {
    return this.creditService.update(id, updateCreditDto);
  }
}
