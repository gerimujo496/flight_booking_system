import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { CreditDal } from './credit.dal';

@Module({
  imports: [TypeOrmModule.forFeature([Credit])],
  controllers: [CreditController],
  providers: [CreditService, CreditDal],
  exports: [CreditService, CreditDal],
})
export class CreditModule {}
