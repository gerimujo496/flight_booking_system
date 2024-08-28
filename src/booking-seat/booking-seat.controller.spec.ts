import { Test, TestingModule } from '@nestjs/testing';
import { BookingSeatController } from './booking-seat.controller';
import { BookingSeatService } from './booking-seat.service';

describe('BookingSeatController', () => {
  let controller: BookingSeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingSeatController],
      providers: [BookingSeatService],
    }).compile();

    controller = module.get<BookingSeatController>(BookingSeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
