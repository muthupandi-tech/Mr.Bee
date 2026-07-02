import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';

@Controller('floors')
export class FloorsController {
  constructor(private readonly service: FloorsService) {}

  @Post()
  create(@Body() dto: CreateFloorDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('buildingId') buildingId?: string) {
    if (buildingId) return this.service.findByBuilding(buildingId);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
