import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import cookieSession = require('cookie-session');
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { seedData } from './database/seeds/database.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({ keys: ['asdfasfd'] }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const dataSource = app.get(DataSource);
  await seedData(dataSource);
  const config = new DocumentBuilder()
    .setTitle('Flight booking system')
    .setDescription('The Booking System API description')
    .setVersion('1.0')
    .addTag('Booking')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3003);
}
bootstrap();
