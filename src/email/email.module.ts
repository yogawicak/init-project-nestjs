import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  exports: [EmailService],
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [EmailService],
})
export class EmailModule {}
