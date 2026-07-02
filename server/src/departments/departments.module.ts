import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DepartmentsRepository } from './departments.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository, PrismaService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
