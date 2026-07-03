import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnnouncementsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.AnnouncementUncheckedCreateInput) {
    return this.prisma.announcement.create({ data });
  }

  findAll() {
    return this.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.announcement.findUnique({ where: { id } });
  }

  delete(id: string) {
    return this.prisma.announcement.delete({ where: { id } });
  }
}
