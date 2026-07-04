import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';

@Controller('floors')
export class FloorsController {
  constructor(private readonly service: FloorsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COLLEGE_ADMIN')
  @Post()
  create(@Body() dto: CreateFloorDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query('buildingId') buildingId?: string) {
    if (buildingId) return this.service.findByBuilding(buildingId);
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COLLEGE_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
