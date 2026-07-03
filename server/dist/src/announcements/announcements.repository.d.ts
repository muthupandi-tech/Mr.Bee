import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class AnnouncementsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AnnouncementUncheckedCreateInput): Prisma.Prisma__AnnouncementClient<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }[]>;
    findById(id: string): Prisma.Prisma__AnnouncementClient<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__AnnouncementClient<{
        id: string;
        collegeId: string;
        description: string | null;
        title: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
