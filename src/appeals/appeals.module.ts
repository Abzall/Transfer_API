import { Module } from '@nestjs/common';
import { AppealsService } from './services/appeals.service';
import { AppealsController } from './controller/appeals.controller';
import { TransferService } from './services/transfer.service';
import { AppealsRepository } from './repositories/appeals.repository';
import { AthleteRepository } from './repositories/athlete.repository';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { ProgramRepository } from './repositories/program.repository';

@Module({
  controllers: [AppealsController],
  providers: [
    // services
    AppealsService,
    TransferService,

    // repositories
    AppealsRepository,
    AthleteRepository,
    EnrollmentRepository,
    ProgramRepository,
  ],
})
export class AppealModule {}
