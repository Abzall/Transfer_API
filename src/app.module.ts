import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppealModule } from './appeals/appeals.module';

@Module({
  imports: [PrismaModule, AppealModule],
})
export class AppModule {}
