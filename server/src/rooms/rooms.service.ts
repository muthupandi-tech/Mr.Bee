import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly repo: RoomsRepository) {}

  create(dto: CreateRoomDto) {
    const { floorId, ...rest } = dto;
    return this.repo.create({
      ...rest,
      rotation: rest.rotation ?? 0,
      floor: { connect: { id: floorId } },
    });
  }

  findAll(search?: string) {
    if (search) return this.repo.search(search);
    return this.repo.findAll();
  }

  findByFloor(floorId: string) { return this.repo.findByFloor(floorId); }

  async findOne(id: string) {
    const room = await this.repo.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
