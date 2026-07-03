import { Injectable, NotFoundException } from '@nestjs/common';
import { FacultyRepository } from './faculty.repository';
import { CreateFacultyDto } from './dto/create-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(private readonly repo: FacultyRepository) {}

  create(dto: CreateFacultyDto) {
    return this.repo.create(dto);
  }

  findAll() { return this.repo.findAll(); }

  async findOne(id: string) {
    const f = await this.repo.findById(id);
    if (!f) throw new NotFoundException('Faculty member not found');
    return f;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
