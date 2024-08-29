import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { BookingSeatService } from './booking-seat.service';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { UpdateBookingSeatDto } from './dto/update-booking-seat.dto';
import { AdminOrEntityOwnerGuard } from 'src/guards/adminOrEntityOwner.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { SeatDto } from './dto/get-freeSeats.dto';

@Controller('booking-seat')
@UseGuards(AuthGuard)
export class BookingSeatController {
  constructor(private readonly bookingSeatService: BookingSeatService) {}

  @UseGuards(AdminOrEntityOwnerGuard)
  @Post('/bookPreferredSeat')
  async create(@Body() createBookingSeatDto: CreateBookingSeatDto) {
    return await this.bookingSeatService.bookPreferredSeat(
      createBookingSeatDto,
    );
  }

  @Post('/bookRandomSeat')
  async bookRandomSeat(@Body() createBookingSeatDto: CreateBookingSeatDto) {
    return await this.bookingSeatService.bookRandomSeat(createBookingSeatDto);
  }
  @UseInterceptors(new SerializerInterceptor(SeatDto))
  @Get('/freeSeats/:flightId')
  async freeSeats(@Param('flightId', ParseIntPipe) flightId: number) {
    return await this.bookingSeatService.getFreeSeats(flightId);
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
