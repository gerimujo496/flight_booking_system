import { Module, forwardRef } from '@nestjs/common';
import { RemoveCredit } from './removeCredits';
import { CreditModule } from 'src/credit/credit.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from 'src/credit/entities/credit.entity';
import { User } from 'src/user/entities/user.entity';
import { GetFreeSeatsHelper } from './getFreeSeats';
import { BookingSeat } from 'src/booking-seat/entities/booking-seat.entity';
import { BookingSeatModule } from 'src/booking-seat/booking-seat.module';

@Module({
  imports: [
    forwardRef(() => CreditModule),
    forwardRef(() => UserModule),
    forwardRef(() => BookingSeatModule),
    TypeOrmModule.forFeature([Credit, User, BookingSeat]),
  ],
  providers: [RemoveCredit, GetFreeSeatsHelper],
  exports: [RemoveCredit, GetFreeSeatsHelper],
})
export class HelpersModule {}
