import { RoomsRepository } from './rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private readonly repo;
    constructor(repo: RoomsRepository);
    create(dto: CreateRoomDto): import(".prisma/client").Prisma.Prisma__RoomClient<{
        floor: {
            id: string;
            collegeId: string;
            floorNumber: number;
            floorName: string;
            buildingId: string;
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
    findAll(search?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
            floorNumber: number;
            floorName: string;
            buildingId: string;
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
    findByFloor(floorId: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    findOne(id: string): Promise<{
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
            floorNumber: number;
            floorName: string;
            buildingId: string;
        };
        events: {
            id: string;
            collegeId: string;
            title: string;
            roomId: string;
            startTime: Date;
            endTime: Date;
        }[];
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            roomId: string | null;
            designation: string | null;
            departmentId: string;
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
