import { PrismaService } from '../prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkDatabase(): Promise<{
        status: string;
        database: string;
        provider: string;
    }>;
}
