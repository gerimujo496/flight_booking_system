import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateBookingSeatDto {
  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  flight_id: number;

  @ApiProperty()
  @IsNumber()
  airplane_id: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  seat_number: number | null = null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  return_flight_id?: number | null = null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  return_airplane_id?: number | null = null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  return_seat_number?: number | null = null;

  @Min(4000)
  @Max(10000)
  @IsOptional()
  price: number;
}
