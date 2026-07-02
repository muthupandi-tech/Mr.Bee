import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collegeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  floorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomName: string;

  @ApiProperty({ description: 'Category: CLASSROOM, LAB, OFFICE, SEMINAR_HALL, CORRIDOR, RESTROOM, STAIRCASE, LIFT' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacity?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  xCoordinate: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  yCoordinate: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  width: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  height: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rotation?: number;
}
