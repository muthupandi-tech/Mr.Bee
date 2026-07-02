import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.EventCreateInput) {
    return this.prisma.event.create({ data, include: { room: true } });
  }

  findAll() {
    return this.prisma.event.findMany({ include: { room: true }, orderBy: { startTime: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.event.findUnique({ where: { id }, include: { room: true } });
  }

  findByRoom(roomId: string) {
    return this.prisma.event.findMany({ where: { roomId }, orderBy: { startTime: 'asc' } });
  }

  delete(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
