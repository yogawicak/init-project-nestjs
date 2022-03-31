import { Test, TestingModule } from '@nestjs/testing';
import { HelpCenterController } from './help_center.controller';
import { HelpCenterService } from './help_center.service';

describe('HelpCenterController', () => {
  let controller: HelpCenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelpCenterController],
      providers: [HelpCenterService],
    }).compile();

    controller = module.get<HelpCenterController>(HelpCenterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
