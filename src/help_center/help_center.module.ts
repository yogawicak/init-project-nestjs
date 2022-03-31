import { Module } from '@nestjs/common';
import { HelpCenterService } from './help_center.service';
import { HelpCenterController } from './help_center.controller';

@Module({
  controllers: [HelpCenterController],
  providers: [HelpCenterService]
})
export class HelpCenterModule {}
