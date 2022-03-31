import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      // errorFormat: 'colorless',
    });
  }

  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.$use(async (param: Prisma.MiddlewareParams, next) => {
      // console.log(JSON.stringify(param));
      return next(param);
    });

    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      this.logger.log(
        'Query: ' + event.query + ' ' + 'Duration: ' + event.duration + 'ms',
        'Query Log',
      );
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
