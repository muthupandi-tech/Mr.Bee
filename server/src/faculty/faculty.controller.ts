import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly service: FacultyService) {}

  @Post()
  create(@Body() dto: CreateFacultyDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
