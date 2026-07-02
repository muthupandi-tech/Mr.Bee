import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FacultyRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.FacultyCreateInput) {
    return this.prisma.faculty.create({ data, include: { department: true, room: true } });
  }

  findAll() {
    return this.prisma.faculty.findMany({ include: { department: true, room: true } });
  }

  findById(id: string) {
    return this.prisma.faculty.findUnique({ where: { id }, include: { department: true, room: true } });
  }

  update(id: string, data: Prisma.FacultyUpdateInput) {
    return this.prisma.faculty.update({ where: { id }, data, include: { department: true, room: true } });
  }

  delete(id: string) {
    return this.prisma.faculty.delete({ where: { id } });
  }
}
