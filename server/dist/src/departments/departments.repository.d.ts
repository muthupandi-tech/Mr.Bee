import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class DepartmentsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.DepartmentUncheckedCreateInput): Prisma.Prisma__DepartmentClient<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): Prisma.PrismaPromise<({
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            designation: string | null;
            departmentId: string;
            roomId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        collegeId: string;
        code: string;
    })[]>;
    findById(id: string): Prisma.Prisma__DepartmentClient<{
        faculty: {
            name: string;
            id: string;
            collegeId: string;
            designation: string | null;
            departmentId: string;
            roomId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.DepartmentUncheckedUpdateInput): Prisma.Prisma__DepartmentClient<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__DepartmentClient<{
        name: string;
        id: string;
        collegeId: string;
        code: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
