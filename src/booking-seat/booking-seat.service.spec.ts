import { Test, TestingModule } from '@nestjs/testing';
import { BookingSeatService } from './booking-seat.service';

describe('BookingSeatService', () => {
  let service: BookingSeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingSeatService],
    }).compile();

    service = module.get<BookingSeatService>(BookingSeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
