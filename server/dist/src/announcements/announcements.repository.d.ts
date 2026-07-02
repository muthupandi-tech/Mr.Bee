import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class AnnouncementsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AnnouncementCreateInput): Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        description: string | null;
        title: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        collegeId: string;
        description: string | null;
        title: string;
    }[]>;
    findById(id: string): Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        description: string | null;
        title: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        description: string | null;
        title: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
