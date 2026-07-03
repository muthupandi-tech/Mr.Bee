import { PrismaService } from '../prisma.service';
import { Building, Prisma } from '@prisma/client';
export declare class BuildingsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.BuildingUncheckedCreateInput): Promise<Building>;
    findAll(): Promise<Building[]>;
    findById(id: string): Promise<Building | null>;
    update(id: string, data: Prisma.BuildingUncheckedUpdateInput): Promise<Building>;
    delete(id: string): Promise<Building>;
}
