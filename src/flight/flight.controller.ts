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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { User } from 'src/user/entities/user.entity';
import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import { SerializerInterceptor } from 'src/iterceptors/serialize.interceptors';
import { FreeSeatsDto } from 'src/booking-seat/dto/get-freeSeats.dto';
import { BookingSeatService } from 'src/booking-seat/booking-seat.service';

@Controller(controller.FLIGHT)
@UseGuards(AuthGuard)
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly bookingService: BookingSeatService,
  ) {}

  @UseGuards(AdminGuard)
  @Post(controller_path.FLIGHT.CREATE_FLIGHT)
  async create(@Body() createFlightDto: CreateFlightDto) {
    return await this.flightService.create(createFlightDto);
  }

  @Get(controller_path.FLIGHT.UPCOMING_FLIGHTS)
  async upcomingFlights() {
    return await this.flightService.upcomingFlights();
  }

  @UseInterceptors(new SerializerInterceptor(FreeSeatsDto))
  @Get(controller_path.FLIGHT.FREE_SEATS)
  async freeSeats(@Param('flightId', ParseIntPipe) flightId: number) {
    return await this.bookingService.getFreeSeats(flightId);
  }

  @Get(controller_path.FLIGHT.FILTER)
  async filter(@Query() filter: FilterFlightDto, @CurrentUser() user: User) {
    return await this.flightService.filter(filter, user);
  }

  @UseGuards(AdminGuard)
  @Get(controller_path.FLIGHT.GET_ALL)
  async findAll() {
    return await this.flightService.findAll();
  }

  @Get(controller_path.FLIGHT.GET_ONE)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.flightService.findOneById(id);
  }

  @UseGuards(AdminGuard)
  @Patch(controller_path.FLIGHT.PATCH_ONE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFlightDto: UpdateFlightDto,
  ) {
    return await this.flightService.update(id, updateFlightDto);
  }

  @Delete(controller_path.FLIGHT.DELETE_ONE)
  remove(@Param('id') id: string) {
    return this.flightService.remove(+id);
  }
}
