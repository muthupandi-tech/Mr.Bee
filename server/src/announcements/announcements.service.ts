import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementsRepository } from './announcements.repository';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly repo: AnnouncementsRepository) {}

  create(dto: CreateAnnouncementDto) { return this.repo.create(dto); }

  findAll() { return this.repo.findAll(); }

  async findOne(id: string) {
    const a = await this.repo.findById(id);
    if (!a) throw new NotFoundException('Announcement not found');
    return a;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
