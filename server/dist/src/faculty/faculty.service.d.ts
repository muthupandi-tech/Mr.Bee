import { FacultyRepository } from './faculty.repository';
import { CreateFacultyDto } from './dto/create-faculty.dto';
export declare class FacultyService {
    private readonly repo;
    constructor(repo: FacultyRepository);
    create(dto: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyClient<{
        department: {
            id: string;
            collegeId: string;
            name: string;
            code: string;
        };
        room: {
            id: string;
            collegeId: string;
            floorId: string;
            roomNumber: string;
            roomName: string;
            category: string;
            capacity: number | null;
            xCoordinate: number;
            yCoordinate: number;
            width: number;
            height: number;
            rotation: number;
        };
    } & {
        id: string;
        collegeId: string;
        name: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        department: {
            id: string;
            collegeId: string;
            name: string;
            code: string;
        };
        room: {
            id: string;
            collegeId: string;
            floorId: string;
            roomNumber: string;
            roomName: string;
            category: string;
            capacity: number | null;
            xCoordinate: number;
            yCoordinate: number;
            width: number;
            height: number;
            rotation: number;
        };
    } & {
        id: string;
        collegeId: string;
        name: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        department: {
            id: string;
            collegeId: string;
            name: string;
            code: string;
        };
        room: {
            id: string;
            collegeId: string;
            floorId: string;
            roomNumber: string;
            roomName: string;
            category: string;
            capacity: number | null;
            xCoordinate: number;
            yCoordinate: number;
            width: number;
            height: number;
            rotation: number;
        };
    } & {
        id: string;
        collegeId: string;
        name: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        collegeId: string;
        name: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }>;
}
