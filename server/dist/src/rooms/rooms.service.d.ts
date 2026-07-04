import { RoomsRepository } from './rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private readonly repo;
    constructor(repo: RoomsRepository);
    create(dto: CreateRoomDto): import(".prisma/client").Prisma.Prisma__RoomClient<{
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
    findAll(search?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
