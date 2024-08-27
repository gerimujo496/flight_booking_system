import { PartialType } from '@nestjs/mapped-types';
import { CreateAirplaneDto } from './create-airplane.dto';

export class UpdateAirplaneDto extends PartialType(CreateAirplaneDto) {}
