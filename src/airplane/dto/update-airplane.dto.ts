import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAirplaneDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(20, { message: 'Name must not exceed 20 characters' })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'Number of seats must be a number' })
  @Min(100, { message: 'Number of seats must be at least 100' })
  @Max(500, { message: 'Number of seats must not exceed 500' })
  @Type(() => Number)
  num_of_seats: number;
}
