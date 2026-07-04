import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CollegesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.college.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const college = await this.prisma.college.findUnique({
      where: { id },
    });
    if (!college) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    return college;
  }

  async create(data: { name: string; domain?: string; address?: string }) {
    return this.prisma.college.create({
      data,
    });
  }

  async update(id: string, data: { name?: string; domain?: string; address?: string }) {
    await this.findOne(id);
    return this.prisma.college.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.college.delete({
      where: { id },
    });
  }
}
