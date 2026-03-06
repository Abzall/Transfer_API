import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgramRepository {
  constructor(private prisma: PrismaService) {}

  findProgram(centerId: string, sport: string) {
    return this.prisma.sportsCenterProgram.findFirst({
      where: {
        sportsCenterId: centerId,
        sportType: sport,
      },
    });
  }
}
