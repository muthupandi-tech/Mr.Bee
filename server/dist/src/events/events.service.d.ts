import { EventsRepository } from './events.repository';
import { CreateEventDto } from './dto/create-event.dto';
export declare class EventsService {
    private readonly repo;
    constructor(repo: EventsRepository);
    create(dto: CreateEventDto): import(".prisma/client").Prisma.Prisma__EventClient<{
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
        title: string;
        roomId: string;
        startTime: Date;
        endTime: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
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
        title: string;
        roomId: string;
        startTime: Date;
        endTime: Date;
    })[]>;
    findByRoom(roomId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        title: string;
        roomId: string;
        startTime: Date;
        endTime: Date;
    }[]>;
    findOne(id: string): Promise<{
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
        title: string;
        roomId: string;
        startTime: Date;
        endTime: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        collegeId: string;
        title: string;
        roomId: string;
        startTime: Date;
        endTime: Date;
    }>;
}
