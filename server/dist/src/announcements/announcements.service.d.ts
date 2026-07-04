import { AnnouncementsRepository } from './announcements.repository';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
export declare class AnnouncementsService {
    private readonly repo;
    constructor(repo: AnnouncementsRepository);
    create(dto: CreateAnnouncementDto): import(".prisma/client").Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }>;
}
