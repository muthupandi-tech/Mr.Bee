import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COLLEGE_ADMIN', 'DEPARTMENT_ADMIN', 'FACULTY')
  @Post()
  create(@Body() dto: CreateEventDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('roomId') roomId?: string) {
    if (roomId) return this.service.findByRoom(roomId);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COLLEGE_ADMIN', 'DEPARTMENT_ADMIN', 'FACULTY')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
