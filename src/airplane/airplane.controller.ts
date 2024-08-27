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
} from '@nestjs/common';
import { AirplaneService } from './airplane.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('airplane')
@UseGuards(AdminGuard)
export class AirplaneController {
  constructor(private readonly airplaneService: AirplaneService) {}

  @Post()
  async create(@Body() createAirplaneDto: CreateAirplaneDto) {
    return await this.airplaneService.create(createAirplaneDto);
  }

  @Get()
  async findAll() {
    return await this.airplaneService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.airplaneService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAirplaneDto: UpdateAirplaneDto,
  ) {
    return await this.airplaneService.update(id, updateAirplaneDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.airplaneService.remove(id);
  }
}
