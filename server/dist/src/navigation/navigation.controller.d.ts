import { NavigationService } from './navigation.service';
export declare class NavigationController {
    private readonly navigationService;
    constructor(navigationService: NavigationService);
    getPath(startRoomId: string, endRoomId: string): Promise<{
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
    } | {
        error: string;
    }>;
    saveLayout(body: any): Promise<{
        success: boolean;
        roomsCount: number;
        nodesCount: number;
        edgesCount: number;
    } | {
        error: string;
    }>;
}
