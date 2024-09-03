import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateCreditDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  credits: number;
}
