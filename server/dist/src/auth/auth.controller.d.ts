import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            collegeId: any;
        };
    }>;
    register(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        collegeId: string | null;
        fullName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
