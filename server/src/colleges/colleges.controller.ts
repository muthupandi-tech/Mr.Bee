import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CollegesService } from './colleges.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  async findAll() {
    return this.collegesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.collegesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async create(@Body() body: { name: string; domain?: string; address?: string }) {
    return this.collegesService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COLLEGE_ADMIN')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; domain?: string; address?: string },
    @Req() req: any,
  ) {
    if (req.user.role === 'COLLEGE_ADMIN' && req.user.collegeId !== id) {
      throw new ForbiddenException('You can only update your own college');
    }
    return this.collegesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async remove(@Param('id') id: string) {
    return this.collegesService.remove(id);
  }
}
