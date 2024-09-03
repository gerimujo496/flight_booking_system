import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreditModule } from './credit/credit.module';
import { AirplaneModule } from './airplane/airplane.module';
import { FlightModule } from './flight/flight.module';
import { BookingSeatModule } from './booking-seat/booking-seat.module';

import cookieSession = require('cookie-session');
import { HelpersModule } from './helpers/helpers.module';
import { EmailModule } from './email/email.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    CreditModule,
    AirplaneModule,
    FlightModule,
    BookingSeatModule,
    HelpersModule,
    EmailModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({ keys: [this.configService.get('COOKIE_KEY')] }),
    );
  }
}
