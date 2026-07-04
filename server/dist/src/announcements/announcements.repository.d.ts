import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class AnnouncementsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AnnouncementUncheckedCreateInput): Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }[]>;
    findById(id: string): Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__AnnouncementClient<{
        id: string;
        createdAt: Date;
        collegeId: string;
        title: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
