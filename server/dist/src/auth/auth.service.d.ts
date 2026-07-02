import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    register(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        collegeId: string | null;
        fullName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
