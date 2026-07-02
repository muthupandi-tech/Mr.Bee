import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Building, Prisma } from '@prisma/client';

@Injectable()
export class BuildingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BuildingCreateInput): Promise<Building> {
    return this.prisma.building.create({ data });
  }

  async findAll(): Promise<Building[]> {
    return this.prisma.building.findMany();
  }

  async findById(id: string): Promise<Building | null> {
    return this.prisma.building.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.BuildingUpdateInput): Promise<Building> {
    return this.prisma.building.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Building> {
    return this.prisma.building.delete({ where: { id } });
  }
}
