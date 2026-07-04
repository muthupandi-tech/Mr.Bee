import { BuildingsRepository } from './buildings.repository';
import { CreateBuildingDto } from './dto/create-building.dto';
export declare class BuildingsService {
    private readonly repository;
    constructor(repository: BuildingsRepository);
    create(dto: CreateBuildingDto): Promise<{
        id: string;
        name: string;
        collegeId: string;
        description: string | null;
        code: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        collegeId: string;
        description: string | null;
        code: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        collegeId: string;
        description: string | null;
        code: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        collegeId: string;
        description: string | null;
        code: string;
    }>;
}
