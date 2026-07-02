import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
export declare class BuildingsController {
    private readonly buildingsService;
    constructor(buildingsService: BuildingsService);
    create(createBuildingDto: CreateBuildingDto): Promise<{
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
