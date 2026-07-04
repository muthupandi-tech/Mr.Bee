import { CollegesService } from './colleges.service';
export declare class CollegesController {
    private readonly collegesService;
    constructor(collegesService: CollegesService);
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
    create(body: {
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
    update(id: string, body: {
        name?: string;
        domain?: string;
        address?: string;
    }, req: any): Promise<{
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
