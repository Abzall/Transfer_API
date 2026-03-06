import { Controller, Post, Param } from '@nestjs/common';
import { AppealsService } from '../services/appeals.service';

@Controller('api/appeals')
export class AppealsController {
  constructor(private readonly appealsService: AppealsService) {}

  @Post(':id/transfer')
  transfer(@Param('id') id: string) {
    return this.appealsService.transferAppeal(id);
  }
}
