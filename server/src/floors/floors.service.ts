import { Injectable, NotFoundException } from '@nestjs/common';
import { FloorsRepository } from './floors.repository';
import { CreateFloorDto } from './dto/create-floor.dto';

@Injectable()
export class FloorsService {
  constructor(private readonly repo: FloorsRepository) {}

  create(dto: CreateFloorDto) {
    return this.repo.create({
      floorNumber: dto.floorNumber,
      floorName: dto.floorName,
      building: { connect: { id: dto.buildingId } },
    });
  }

  findAll() { return this.repo.findAll(); }

  findByBuilding(buildingId: string) { return this.repo.findByBuilding(buildingId); }

  async findOne(id: string) {
    const floor = await this.repo.findById(id);
    if (!floor) throw new NotFoundException('Floor not found');
    return floor;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
