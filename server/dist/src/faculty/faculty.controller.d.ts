import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
export declare class FacultyController {
    private readonly service;
    constructor(service: FacultyService);
    create(dto: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyClient<{
        department: {
            id: string;
            name: string;
            collegeId: string;
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
        name: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        department: {
            id: string;
            name: string;
            collegeId: string;
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
        name: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        department: {
            id: string;
            name: string;
            collegeId: string;
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
        name: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }>;
}
