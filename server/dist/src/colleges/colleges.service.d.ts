import { PrismaService } from '../prisma.service';
export declare class CollegesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        domain: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        domain: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: {
        name: string;
        domain?: string;
        address?: string;
    }): Promise<{
        id: string;
        name: string;
        domain: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        domain?: string;
        address?: string;
    }): Promise<{
        id: string;
        name: string;
        domain: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        domain: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
