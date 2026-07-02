import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class EventsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.EventCreateInput): Prisma.Prisma__EventClient<{
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
        roomId: string;
        title: string;
        startTime: Date;
        endTime: Date;
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
    } & {
        id: string;
        collegeId: string;
        roomId: string;
        title: string;
        startTime: Date;
        endTime: Date;
    })[]>;
    findById(id: string): Prisma.Prisma__EventClient<{
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
        roomId: string;
        title: string;
        startTime: Date;
        endTime: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByRoom(roomId: string): Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        roomId: string;
        title: string;
        startTime: Date;
        endTime: Date;
    }[]>;
    delete(id: string): Prisma.Prisma__EventClient<{
        id: string;
        collegeId: string;
        roomId: string;
        title: string;
        startTime: Date;
        endTime: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
