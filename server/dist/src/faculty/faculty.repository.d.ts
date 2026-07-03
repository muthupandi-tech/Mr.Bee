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
            name: string;
            id: string;
            collegeId: string;
            code: string;
        };
    } & {
        name: string;
        id: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
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
            name: string;
            id: string;
            collegeId: string;
            code: string;
        };
    } & {
        name: string;
        id: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
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
            name: string;
            id: string;
            collegeId: string;
            code: string;
        };
    } & {
        name: string;
        id: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
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
            name: string;
            id: string;
            collegeId: string;
            code: string;
        };
    } & {
        name: string;
        id: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__FacultyClient<{
        name: string;
        id: string;
        collegeId: string;
        designation: string | null;
        departmentId: string;
        roomId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
