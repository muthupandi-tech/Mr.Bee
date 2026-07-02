import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('roomId') roomId?: string) {
    if (roomId) return this.service.findByRoom(roomId);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
