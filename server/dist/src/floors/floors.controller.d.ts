import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
export declare class FloorsController {
    private readonly service;
    constructor(service: FloorsService);
    create(dto: CreateFloorDto): import(".prisma/client").Prisma.Prisma__FloorClient<{
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
        floorNumber: number;
        floorName: string;
        buildingId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(buildingId?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        floorNumber: number;
        floorName: string;
        buildingId: string;
    }[]>;
    findOne(id: string): Promise<{
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
                type: string;
                fromNodeId: string;
                toNodeId: string;
                distance: number;
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
        floorNumber: number;
        floorName: string;
        buildingId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        collegeId: string;
        floorNumber: number;
        floorName: string;
        buildingId: string;
    }>;
}
