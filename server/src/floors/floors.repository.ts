import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FloorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.FloorCreateInput) {
    return this.prisma.floor.create({ data, include: { building: true } });
  }

  findAll() {
    return this.prisma.floor.findMany({ include: { building: true } });
  }

  findById(id: string) {
    return this.prisma.floor.findUnique({
      where: { id },
      include: {
        building: true,
        rooms: true,
        nodes: {
          include: {
            outgoing: true,
          }
        }
      }
    });
  }

  findByBuilding(buildingId: string) {
    return this.prisma.floor.findMany({ where: { buildingId }, orderBy: { floorNumber: 'asc' } });
  }

  update(id: string, data: Prisma.FloorUpdateInput) {
    return this.prisma.floor.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.floor.delete({ where: { id } });
  }
}
