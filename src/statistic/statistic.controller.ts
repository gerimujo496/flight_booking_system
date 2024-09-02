import { Controller, Get, UseGuards } from '@nestjs/common';

import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import { FlightService } from 'src/flight/flight.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { BookingSeatService } from 'src/booking-seat/booking-seat.service';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(controller.STATISTIC)
@Controller(controller.STATISTIC)
@UseGuards(AdminGuard)
export class StatisticController {
  constructor(
    private flightService: FlightService,
    private bookingSeatService: BookingSeatService,
    private usersService: UserService,
  ) {}

  @Get(controller_path.STATISTIC.NUMBER_OF_FLIGHTS)
  totalFlights() {
    return this.flightService.getNumberOfFlights();
  }

  @Get(controller_path.STATISTIC.TOTAL_REVENUE)
  async totalRevenue() {
    return await this.bookingSeatService.totalRevenue();
  }

  @Get(controller_path.STATISTIC.PASSENGER_NUMBER)
  async usersNUmber() {
    return await this.usersService.passengersNumber();
  }

  @Get(controller_path.STATISTIC.TOP_3_CLIENTS_WHO_HAVE_BOOKED_MORE)
  async top3ClientsWHoHaveBookedMore() {
    return await this.bookingSeatService.topThreeClientsWhoHaveBookedMore();
  }

  @Get(controller_path.STATISTIC.TOP_3_CLIENTS_WHO_HAVE_SPEND_MORE)
  async top3ClientsWHoHaveSpentMore() {
    return await this.bookingSeatService.topThreeClientsWhoHaveSpentMore();
  }
}
