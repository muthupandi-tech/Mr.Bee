import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly repo: DepartmentsRepository) {}

  async create(dto: CreateDepartmentDto) {
    try {
      return await this.repo.create(dto);
    } catch (e) {
      if (e.code === 'P2002') throw new ConflictException('Department code already exists');
      throw e;
    }
  }

  findAll() { return this.repo.findAll(); }

  async findOne(id: string) {
    const dept = await this.repo.findById(id);
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
