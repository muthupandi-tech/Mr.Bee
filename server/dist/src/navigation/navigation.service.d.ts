import { PrismaService } from '../prisma.service';
export declare class NavigationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPath(startRoomId: string, endRoomId: string): Promise<{
        startRoom: {
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
        endRoom: {
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
        distance: number;
        path: any[];
        fullPathPoints: {
            x: number;
            y: number;
            floorId: string;
        }[];
    }>;
    saveLayout(floorId: string, roomsData: any[], nodesData: any[], edgesData: any[]): Promise<{
        success: boolean;
        roomsCount: number;
        nodesCount: number;
        edgesCount: number;
    }>;
}
