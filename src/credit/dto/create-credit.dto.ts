import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCreditDto {
  user_id: User;

  @ApiProperty()
  @IsNumber()
  @Min(5000)
  @Max(15000)
  credits: number;
}
