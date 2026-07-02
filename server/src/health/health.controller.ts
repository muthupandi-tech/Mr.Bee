import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('database')
  async checkDatabase() {
    try {
      // Execute a simple query to verify the connection is alive
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'connected',
        database: 'SQLite',
        provider: 'Prisma'
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'disconnected',
          database: 'SQLite',
          provider: 'Prisma',
          error: error.message
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
