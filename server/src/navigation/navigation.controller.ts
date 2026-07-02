import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get('path')
  async getPath(
    @Query('startRoomId') startRoomId: string,
    @Query('endRoomId') endRoomId: string,
  ) {
    if (!startRoomId || !endRoomId) {
      return { error: 'startRoomId and endRoomId are required parameters.' };
    }
    return this.navigationService.findPath(startRoomId, endRoomId);
  }

  @Post('save-layout')
  async saveLayout(@Body() body: any) {
    const { floorId, rooms, nodes, edges } = body;
    if (!floorId) {
      return { error: 'floorId is a required parameter.' };
    }
    return this.navigationService.saveLayout(
      floorId,
      rooms || [],
      nodes || [],
      edges || [],
    );
  }
}
