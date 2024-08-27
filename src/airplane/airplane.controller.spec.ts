import { Test, TestingModule } from '@nestjs/testing';
import { AirplaneController } from './airplane.controller';
import { AirplaneService } from './airplane.service';

describe('AirplaneController', () => {
  let controller: AirplaneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirplaneController],
      providers: [AirplaneService],
    }).compile();

    controller = module.get<AirplaneController>(AirplaneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
