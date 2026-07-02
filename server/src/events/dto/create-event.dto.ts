import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collegeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'ISO 8601 date string', example: '2026-08-15T09:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'ISO 8601 date string', example: '2026-08-15T17:00:00Z' })
  @IsDateString()
  endTime: string;
}
