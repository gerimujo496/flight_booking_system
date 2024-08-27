import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateAirplaneDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsNumber()
  @Max(500)
  @Min(100)
  numOfSeats: number;
}
