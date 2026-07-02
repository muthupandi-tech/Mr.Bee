import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.DepartmentCreateInput) {
    return this.prisma.department.create({ data });
  }

  findAll() {
    return this.prisma.department.findMany({ include: { faculty: true } });
  }

  findById(id: string) {
    return this.prisma.department.findUnique({ where: { id }, include: { faculty: true } });
  }

  update(id: string, data: Prisma.DepartmentUpdateInput) {
    return this.prisma.department.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.department.delete({ where: { id } });
  }
}
