import { Injectable } from '@nestjs/common';
import { SportsCenterProgram } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentRepository {
  constructor(private prisma: PrismaService) {}

  findApprovedEnrollment(athleteId: string, centerId: string) {
    return this.prisma.enrollment.findFirst({
      where: {
        athleteProfileId: athleteId,
        sportsCenterId: centerId,
        status: 'APPROVED',
      },
    });
  }

  async hasAvailableSpot(program: SportsCenterProgram): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: { programId: program.id },
    });

    return count < program.capacity;
  }

  transferEnrollment(
    enrollmentId: string,
    athleteId: string,
    centerId: string,
    programId: string,
  ) {
    return this.prisma.$transaction([
      this.prisma.enrollment.update({
        where: { id: enrollmentId },
        data: { status: 'CANCELLED' },
      }),
      this.prisma.enrollment.create({
        data: {
          athleteProfileId: athleteId,
          sportsCenterId: centerId,
          programId,
          status: 'PENDING',
        },
      }),
    ]);
  }
}
