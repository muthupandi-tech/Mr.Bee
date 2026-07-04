import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class FacultyRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.FacultyUncheckedCreateInput): Prisma.Prisma__FacultyClient<{
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
    findAll(): Prisma.PrismaPromise<({
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
    findById(id: string): Prisma.Prisma__FacultyClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.FacultyUncheckedUpdateInput): Prisma.Prisma__FacultyClient<{
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
    delete(id: string): Prisma.Prisma__FacultyClient<{
        id: string;
        name: string;
        collegeId: string;
        roomId: string | null;
        designation: string | null;
        departmentId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
