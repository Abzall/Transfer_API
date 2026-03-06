import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete.repository';
import { EnrollmentRepository } from '../repositories/enrollment.repository';
import { TransferResult } from '../types/transfer-result.type';
import { AppealChild, SportsCenterProgram } from 'generated/prisma/client';
import { TransferPayload } from '../types/transfer-payload.type';

@Injectable()
export class TransferService {
  constructor(
    private athleteRepo: AthleteRepository,
    private enrollmentRepo: EnrollmentRepository,
  ) {}

  async transferChildren(
    children: AppealChild[],
    payload: TransferPayload,
    program: SportsCenterProgram,
  ): Promise<TransferResult[]> {
    const results: TransferResult[] = [];

    for (const child of children) {
      try {
        const athlete = await this.athleteRepo.findByIin(child.childIin);

        if (!athlete) throw new Error('Athlete not found');

        const enrollment = await this.enrollmentRepo.findApprovedEnrollment(
          athlete.id,
          payload.currentProviderId,
        );

        if (!enrollment) throw new Error('Approved enrollment not found');

        const hasSpot = await this.enrollmentRepo.hasAvailableSpot(program);

        if (!hasSpot) throw new Error('No available spots');

        await this.enrollmentRepo.transferEnrollment(
          enrollment.id,
          athlete.id,
          payload.targetProviderId,
          program.id,
        );

        results.push({
          childId: child.id,
          success: true,
        });
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error';

        results.push({
          childId: child.id,
          success: false,
          error,
        });
      }
    }

    return results;
  }
}
