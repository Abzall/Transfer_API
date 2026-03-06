import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppealsRepository {
  constructor(private prisma: PrismaService) {}

  findByIdWithChildren(id: string) {
    return this.prisma.appeal.findUnique({
      where: { id },
      include: { children: true },
    });
  }

  resolveAppeal(id: string) {
    return this.prisma.appeal.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });
  }
}
