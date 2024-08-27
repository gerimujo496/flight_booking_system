import { IsNumber, Max, Min } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCreditDto {
  userId: User;

  @IsNumber()
  @Min(5000)
  @Max(15000)
  credits: number;
}
