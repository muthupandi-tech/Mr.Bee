import { FloorsRepository } from './floors.repository';
import { CreateFloorDto } from './dto/create-floor.dto';
export declare class FloorsService {
    private readonly repo;
    constructor(repo: FloorsRepository);
    create(dto: CreateFloorDto): import(".prisma/client").Prisma.Prisma__FloorClient<{
        building: {
            id: string;
            collegeId: string;
            name: string;
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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        building: {
            id: string;
            collegeId: string;
            name: string;
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
    findByBuilding(buildingId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        buildingId: string;
        floorNumber: number;
        floorName: string;
    }[]>;
    findOne(id: string): Promise<{
        building: {
            id: string;
            collegeId: string;
            name: string;
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
    }>;
    remove(id: string): Promise<{
        id: string;
        collegeId: string;
        buildingId: string;
        floorNumber: number;
        floorName: string;
    }>;
}
