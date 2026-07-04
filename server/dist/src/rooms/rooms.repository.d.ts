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
                id: string;
                name: string;
                collegeId: string;
                description: string | null;
                code: string;
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
        faculty: {
            id: string;
            name: string;
            collegeId: string;
            roomId: string | null;
            designation: string | null;
            departmentId: string;
        }[];
        events: {
            id: string;
            collegeId: string;
            title: string;
            roomId: string;
            startTime: Date;
            endTime: Date;
        }[];
        floor: {
            building: {
                id: string;
                name: string;
                collegeId: string;
                description: string | null;
                code: string;
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
        faculty: {
            id: string;
            name: string;
            collegeId: string;
            roomId: string | null;
            designation: string | null;
            departmentId: string;
        }[];
        floor: {
            building: {
                id: string;
                name: string;
                collegeId: string;
                description: string | null;
                code: string;
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
