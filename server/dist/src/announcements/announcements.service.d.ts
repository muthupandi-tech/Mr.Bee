import { AnnouncementsRepository } from './announcements.repository';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
export declare class AnnouncementsService {
    private readonly repo;
    constructor(repo: AnnouncementsRepository);
    create(dto: CreateAnnouncementDto): import(".prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }>;
}
