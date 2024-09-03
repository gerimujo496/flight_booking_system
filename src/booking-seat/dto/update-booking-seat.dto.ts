import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingSeatDto } from './create-booking-seat.dto';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingSeatDto extends PartialType(CreateBookingSeatDto) {
  @ApiProperty()
  @IsBoolean()
  isApproved: boolean;
}
