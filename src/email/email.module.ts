import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendgridClient } from './sendgrid-client';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, SendgridClient],
  exports: [EmailService],
})
export class EmailModule {}
