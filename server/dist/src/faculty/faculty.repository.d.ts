import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class FacultyRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.FacultyCreateInput): Prisma.Prisma__FacultyClient<{
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
    findAll(): Prisma.PrismaPromise<({
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
    findById(id: string): Prisma.Prisma__FacultyClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.FacultyUpdateInput): Prisma.Prisma__FacultyClient<{
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
    delete(id: string): Prisma.Prisma__FacultyClient<{
        id: string;
        name: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
