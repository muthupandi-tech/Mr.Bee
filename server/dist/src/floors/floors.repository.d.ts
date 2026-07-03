import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class FloorsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.FloorUncheckedCreateInput): Prisma.Prisma__FloorClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<({
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
    })[]>;
    findById(id: string): Prisma.Prisma__FloorClient<{
        building: {
            name: string;
            id: string;
            collegeId: string;
            code: string;
            description: string | null;
        };
        rooms: {
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
        }[];
        nodes: ({
            outgoing: {
                id: string;
                collegeId: string;
                fromNodeId: string;
                toNodeId: string;
                distance: number;
                type: string;
                isAccessible: boolean;
            }[];
        } & {
            id: string;
            collegeId: string;
            floorId: string;
            x: number;
            y: number;
        })[];
    } & {
        id: string;
        collegeId: string;
        buildingId: string;
        floorNumber: number;
        floorName: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByBuilding(buildingId: string): Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        buildingId: string;
        floorNumber: number;
        floorName: string;
    }[]>;
    update(id: string, data: Prisma.FloorUncheckedUpdateInput): Prisma.Prisma__FloorClient<{
        id: string;
        collegeId: string;
        buildingId: string;
        floorNumber: number;
        floorName: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__FloorClient<{
        id: string;
        collegeId: string;
        buildingId: string;
        floorNumber: number;
        floorName: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
