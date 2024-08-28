import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingSeatDto } from './create-booking-seat.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBookingSeatDto extends PartialType(CreateBookingSeatDto) {
  @IsBoolean()
  isApproved: boolean;
}
