import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  public async findUserConsumerByEmail(email: string) {
    return await this.prismaService.user_consumer.findFirst({
      where: {
        email,
      },
    });
  }

  public async findUserAdminByEmail(email: string) {
    return await this.prismaService.user_admin.findFirst({
      where: {
        email,
      },
    });
  }

  public async checkVerifUserByEmail(email: string) {
    if (
      await this.prismaService.user_consumer.findFirst({
        where: {
          email,
        },
        select: {
          is_verif_email: true,
        },
      })
    ) {
      return true;
    }
    return false;
  }
}
