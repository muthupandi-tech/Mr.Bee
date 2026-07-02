import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly repo: EventsRepository) {}

  create(dto: CreateEventDto) {
    return this.repo.create({
      title: dto.title,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      room: { connect: { id: dto.roomId } },
    });
  }

  findAll() { return this.repo.findAll(); }

  findByRoom(roomId: string) { return this.repo.findByRoom(roomId); }

  async findOne(id: string) {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
