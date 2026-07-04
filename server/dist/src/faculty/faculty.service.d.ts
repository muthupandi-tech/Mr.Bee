import { FacultyRepository } from './faculty.repository';
import { CreateFacultyDto } from './dto/create-faculty.dto';
export declare class FacultyService {
    private readonly repo;
    constructor(repo: FacultyRepository);
    create(dto: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyClient<{
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
        department: {
            id: string;
            name: string;
            collegeId: string;
            code: string;
        };
    } & {
        id: string;
        name: string;
        collegeId: string;
        roomId: string | null;
        designation: string | null;
        departmentId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        department: {
            id: string;
            name: string;
            collegeId: string;
            code: string;
        };
    } & {
        id: string;
        name: string;
        collegeId: string;
        roomId: string | null;
        designation: string | null;
        departmentId: string;
    })[]>;
    findOne(id: string): Promise<{
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
        department: {
            id: string;
            name: string;
            collegeId: string;
            code: string;
        };
    } & {
        id: string;
        name: string;
        collegeId: string;
        roomId: string | null;
        designation: string | null;
        departmentId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        collegeId: string;
        roomId: string | null;
        designation: string | null;
        departmentId: string;
    }>;
}
