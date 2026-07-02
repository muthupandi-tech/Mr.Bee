import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.RoomCreateInput) {
    return this.prisma.room.create({ data, include: { floor: true } });
  }

  findAll() {
    return this.prisma.room.findMany({ include: { floor: { include: { building: true } } } });
  }

  findById(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { floor: { include: { building: true } }, faculty: true, events: true },
    });
  }

  findByFloor(floorId: string) {
    return this.prisma.room.findMany({ where: { floorId } });
  }

  search(query: string) {
    return this.prisma.room.findMany({
      where: {
        OR: [
          { roomName: { contains: query } },
          { roomNumber: { contains: query } },
          { category: { contains: query } },
          {
            faculty: {
              some: {
                name: { contains: query }
              }
            }
          }
        ]
      },
      include: {
        floor: { include: { building: true } },
        faculty: true
      }
    });
  }

  update(id: string, data: Prisma.RoomUpdateInput) {
    return this.prisma.room.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }
}
