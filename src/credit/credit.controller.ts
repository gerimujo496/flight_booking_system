import {
  Controller,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { CreditService } from './credit.service';
import { UpdateCreditDto } from './dto/update-credit.dto';

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCreditDto: UpdateCreditDto,
  ) {
    return this.creditService.update(id, updateCreditDto);
  }

  @Get(':id')
  get(
    @Param('id', ParseIntPipe) id: number,
    // @Body() updateCreditDto: UpdateCreditDto,
  ) {
    return this.creditService.findOne(id);
  }
}
