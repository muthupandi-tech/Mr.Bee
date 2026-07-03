import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class RoomsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.RoomUncheckedCreateInput): Prisma.Prisma__RoomClient<{
        floor: {
            id: string;
            collegeId: string;
            buildingId: string;
            floorNumber: number;
            floorName: string;
        };
    } & {
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<({
        floor: {
            building: {
                name: string;
                id: string;
                collegeId: string;
                code: string;
                description: string | null;
            };
        } & {
            id: string;
            collegeId: string;
            buildingId: string;
            floorNumber: number;
            floorName: string;
        };
    } & {
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
    })[]>;
    findById(id: string): Prisma.Prisma__RoomClient<{
        floor: {
            building: {
                name: string;
                id: string;
                collegeId: string;
                code: string;
                description: string | null;
            };
        } & {
            id: string;
            collegeId: string;
            buildingId: string;
            floorNumber: number;
            floorName: string;
        };
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            designation: string | null;
            departmentId: string;
            roomId: string | null;
        }[];
        events: {
            id: string;
            collegeId: string;
            roomId: string;
            title: string;
            startTime: Date;
            endTime: Date;
        }[];
    } & {
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByFloor(floorId: string): Prisma.PrismaPromise<{
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
    }[]>;
    search(query: string): Prisma.PrismaPromise<({
        floor: {
            building: {
                name: string;
                id: string;
                collegeId: string;
                code: string;
                description: string | null;
            };
        } & {
            id: string;
            collegeId: string;
            buildingId: string;
            floorNumber: number;
            floorName: string;
        };
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            designation: string | null;
            departmentId: string;
            roomId: string | null;
        }[];
    } & {
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
    })[]>;
    update(id: string, data: Prisma.RoomUncheckedUpdateInput): Prisma.Prisma__RoomClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__RoomClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
