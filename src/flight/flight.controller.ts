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
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterFlightDto } from './dto/filter-flight.dto';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('flight')
@UseGuards(AuthGuard)
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createFlightDto: CreateFlightDto) {
    return await this.flightService.create(createFlightDto);
  }

  @Get('/upcomingFlights')
  async upcomingFlights() {
    return await this.flightService.upcomingFlights();
  }

  @Get('filter')
  async filter(@Query() filter: FilterFlightDto, @CurrentUser() user: User) {
    return await this.flightService.filter(filter, user);
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return await this.flightService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.flightService.findOneById(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFlightDto: UpdateFlightDto,
  ) {
    return await this.flightService.update(id, updateFlightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightService.remove(+id);
  }
}
