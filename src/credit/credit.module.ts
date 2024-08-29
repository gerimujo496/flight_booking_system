import { Module, forwardRef } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { CreditDal } from './credit.dal';
import { User } from 'src/user/entities/user.entity';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credit, User]),
    forwardRef(() => HelpersModule),
  ],
  controllers: [CreditController],
  providers: [CreditService, CreditDal],
  exports: [CreditService, CreditDal],
})
export class CreditModule {}
