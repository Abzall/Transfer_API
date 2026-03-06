import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AthleteRepository {
  constructor(private prisma: PrismaService) {}

  findByIin(iin: string) {
    return this.prisma.athleteProfile.findUnique({
      where: { iin },
    });
  }
}
