import { BuildingsRepository } from './buildings.repository';
import { CreateBuildingDto } from './dto/create-building.dto';
export declare class BuildingsService {
    private readonly repository;
    constructor(repository: BuildingsRepository);
    create(dto: CreateBuildingDto): Promise<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
        description: string | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
        description: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
        description: string | null;
    }>;
}
