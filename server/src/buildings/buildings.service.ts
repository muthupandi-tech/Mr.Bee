import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BuildingsRepository } from './buildings.repository';
import { CreateBuildingDto } from './dto/create-building.dto';

@Injectable()
export class BuildingsService {
  constructor(private readonly repository: BuildingsRepository) {}

  async create(dto: CreateBuildingDto) {
    try {
      return await this.repository.create(dto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Building code already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const building = await this.repository.findById(id);
    if (!building) throw new NotFoundException('Building not found');
    return building;
  }

  async remove(id: string) {
    await this.findOne(id); // verify exists
    return this.repository.delete(id);
  }
}
