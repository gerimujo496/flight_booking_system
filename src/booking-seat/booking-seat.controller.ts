import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingSeatService } from './booking-seat.service';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { UpdateBookingSeatDto } from './dto/update-booking-seat.dto';
import { AdminOrEntityOwnerGuard } from 'src/guards/adminOrEntityOwner.guard';

@Controller('booking-seat')
export class BookingSeatController {
  constructor(private readonly bookingSeatService: BookingSeatService) {}

  @UseGuards(AdminOrEntityOwnerGuard)
  @Post()
  async create(@Body() createBookingSeatDto: CreateBookingSeatDto) {
    return await this.bookingSeatService.create(createBookingSeatDto);
  }

  @Get()
  findAll() {
    return this.bookingSeatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingSeatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingSeatDto: UpdateBookingSeatDto,
  ) {
    return this.bookingSeatService.update(+id, updateBookingSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingSeatService.remove(+id);
  }
}
