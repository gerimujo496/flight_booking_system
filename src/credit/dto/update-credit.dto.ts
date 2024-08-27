import { IsNumber, Min } from 'class-validator';

export class UpdateCreditDto {
  @IsNumber()
  @Min(0)
  credits: number;
}
