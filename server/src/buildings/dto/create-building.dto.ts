import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collegeId: string;

  @ApiProperty({ description: 'The name of the building' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'A unique code for the building (e.g., SEB)' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Optional description of the building', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
