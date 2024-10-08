import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreditModule } from 'src/credit/credit.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Credit } from 'src/credit/entities/credit.entity';
import { CurrentUserMiddleware } from 'src/middleware/current-user.middleware';
import { UserDal } from './user.dal';

@Module({
  imports: [CreditModule, TypeOrmModule.forFeature([User, Credit])],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, UserDal],
  exports: [UserService, UserDal],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
