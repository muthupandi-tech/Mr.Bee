import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto) { return this.service.create(dto); }

  @Get()
  findAll(
    @Query('floorId') floorId?: string,
    @Query('search') search?: string,
  ) {
    if (floorId) return this.service.findByFloor(floorId);
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
