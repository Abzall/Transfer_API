import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AppealsRepository } from '../repositories/appeals.repository';
import { ProgramRepository } from '../repositories/program.repository';
import { TransferService } from './transfer.service';
import { parseTransferMessage } from '../utils/parse-transfer-message.util';

@Injectable()
export class AppealsService {
  constructor(
    private appealsRepo: AppealsRepository,
    private programRepo: ProgramRepository,
    private transferService: TransferService,
  ) {}

  async transferAppeal(id: string) {
    const appeal = await this.appealsRepo.findByIdWithChildren(id);

    if (!appeal) throw new NotFoundException('Appeal not found');

    if (appeal.category !== 'CHANGE_PROVIDER')
      throw new BadRequestException('Wrong category');

    const payload = parseTransferMessage(appeal.message);

    const program = await this.programRepo.findProgram(
      payload.targetProviderId,
      payload.targetSport,
    );

    if (!program) throw new NotFoundException('Target program not found');

    const results = await this.transferService.transferChildren(
      appeal.children,
      payload,
      program,
    );

    const allTransferred = results.every((r) => r.success);

    if (allTransferred) {
      await this.appealsRepo.resolveAppeal(id);
    }

    return {
      success: true,
      allTransferred,
      results,
    };
  }
}
