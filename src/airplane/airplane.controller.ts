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
  UsePipes,
} from '@nestjs/common';
import { AirplaneService } from './airplane.service';
import {
  CreateAirplaneDto,
  CreateAirplaneSchema,
} from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { controller } from 'src/constants/controller';
import { controller_path } from 'src/constants/controllerPath';
import {
  FilterAirplaneDto,
  FilterAirplaneSchema,
} from './dto/filter-airplane.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller(controller.AIRPLANE)
@ApiTags(controller.AIRPLANE)
@UseGuards(AdminGuard)
export class AirplaneController {
  constructor(private readonly airplaneService: AirplaneService) {}

  @Post(controller_path.AIRPLANE.CREATE)
  @UsePipes(new ZodValidationPipe(CreateAirplaneSchema))
  async create(@Body() createAirplaneDto: CreateAirplaneDto) {
    return await this.airplaneService.create(createAirplaneDto);
  }

  @ApiQuery({
    name: 'arrival_time',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'departure_time',
    type: 'string',
    required: true,
  })
  @UsePipes(new ZodValidationPipe(FilterAirplaneSchema))
  @Get(controller_path.AIRPLANE.AVAILABLE_AIRPLANES)
  async filterAirplanes(@Query() filter: FilterAirplaneDto) {
    return await this.airplaneService.filterAirplanes(filter);
  }

  @Get(controller_path.AIRPLANE.GET_ALL)
  async findAll() {
    return await this.airplaneService.findAll();
  }

  @Get(controller_path.AIRPLANE.GET_ONE)
  async findOne(@Param('id') id: string) {
    return await this.airplaneService.findOneById(+id);
  }

  @Patch(controller_path.AIRPLANE.PATCH_ONE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAirplaneDto: UpdateAirplaneDto,
  ) {
    return await this.airplaneService.update(id, updateAirplaneDto);
  }

  @Delete(controller_path.AIRPLANE.DELETE_ONE)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.airplaneService.remove(id);
  }
}
