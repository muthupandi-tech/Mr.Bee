import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsRepository } from './announcements.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AnnouncementsRepository, PrismaService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
