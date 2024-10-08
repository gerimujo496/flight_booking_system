import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BookingSeatService } from './booking-seat.service';
import { CreateBookingSeatDto } from './dto/create-booking-seat.dto';
import { AdminOrEntityOwnerGuard } from 'src/guards/adminOrEntityOwner.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { AdminGuard } from 'src/guards/admin.guard';
import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import { BookingSeatsDto } from './dto/seats.dto';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { User } from 'src/user/entities/user.entity';

@Controller(controller.BOOKING_SEAT)
@UseGuards(AuthGuard)
@UseInterceptors(new SerializerInterceptor(BookingSeatsDto))
@ApiTags(controller.BOOKING_SEAT)
export class BookingSeatController {
  constructor(private readonly bookingSeatService: BookingSeatService) {}

  @UseGuards(AdminOrEntityOwnerGuard)
  @Post(controller_path.BOOKING_SEAT.BOOK_SEAT)
  async bookSeat(@Body() createBookingSeatDto: CreateBookingSeatDto) {
    return await this.bookingSeatService.bookSeat(createBookingSeatDto);
  }

  @UseGuards(AdminGuard)
  @Patch(controller_path.BOOKING_SEAT.APPROVE_BOOKING)
  async approveBooking(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingSeatService.approveBooking(id);
  }

  @UseGuards(AdminOrEntityOwnerGuard)
  @Get(controller_path.BOOKING_SEAT.USER_HISTORY)
  async bookingHistory(@CurrentUser() user: User) {
    return await this.bookingSeatService.getBookingHistory(user.id);
  }

  @UseGuards(AdminGuard)
  @Get(controller_path.BOOKING_SEAT.PRINT_APPROVED_TICKET)
  async printApprovedTicket(
    @Param('id', ParseIntPipe) id: number,
    @Response() res,
  ) {
    const pdfBuffer = await this.bookingSeatService.printApprovedTicket(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf');
    res.send(pdfBuffer);
  }

  @UseGuards(AdminGuard)
  @Patch(controller_path.BOOKING_SEAT.REJECT_BOOKING)
  async rejectBooking(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingSeatService.rejectBooking(id);
  }

  @UseGuards(AdminGuard)
  @Get(controller_path.BOOKING_SEAT.GET_ALL)
  async findAll() {
    return await this.bookingSeatService.findAll();
  }

  @UseGuards(AdminOrEntityOwnerGuard)
  @Get(controller_path.BOOKING_SEAT.GET_ONE)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bookingSeatService.findOne(id);
  }
}
