import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFloorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collegeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buildingId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  floorNumber: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  floorName: string;
}
