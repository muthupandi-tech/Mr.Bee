import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { BuildingsRepository } from './buildings.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService, BuildingsRepository, PrismaService],
  exports: [BuildingsService]
})
export class BuildingsModule {}
