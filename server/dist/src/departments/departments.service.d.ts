import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
export declare class DepartmentsService {
    private readonly repo;
    constructor(repo: DepartmentsRepository);
    create(dto: CreateDepartmentDto): Promise<{
        id: string;
        name: string;
        collegeId: string;
        code: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        faculty: {
            id: string;
            name: string;
            collegeId: string;
            roomId: string | null;
            designation: string | null;
            departmentId: string;
        }[];
    } & {
        id: string;
        name: string;
        collegeId: string;
        code: string;
    })[]>;
    findOne(id: string): Promise<{
        faculty: {
            id: string;
            name: string;
            collegeId: string;
            roomId: string | null;
            designation: string | null;
            departmentId: string;
        }[];
    } & {
        id: string;
        name: string;
        collegeId: string;
        code: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        collegeId: string;
        code: string;
    }>;
}
