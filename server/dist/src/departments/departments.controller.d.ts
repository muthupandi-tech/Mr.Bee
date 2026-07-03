import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
export declare class DepartmentsController {
    private readonly service;
    constructor(service: DepartmentsService);
    create(dto: CreateDepartmentDto): Promise<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            designation: string | null;
            departmentId: string;
            roomId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        collegeId: string;
        code: string;
    })[]>;
    findOne(id: string): Promise<{
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            designation: string | null;
            departmentId: string;
            roomId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }>;
}
