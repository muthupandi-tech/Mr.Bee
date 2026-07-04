import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { tenantStorage } from './tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    let collegeId: string | null = null;
    let role: string | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded) {
          collegeId = decoded.collegeId || null;
          role = decoded.role || null;
        }
      } catch (err) {
        // Ignore invalid tokens and fall back
      }
    }

    if (!collegeId) {
      const headerCollegeId = req.headers['x-college-id'];
      if (headerCollegeId) {
        collegeId = Array.isArray(headerCollegeId) ? headerCollegeId[0] : headerCollegeId;
      }
    }

    if (!collegeId) {
      const queryCollegeId = req.query.collegeId;
      if (queryCollegeId) {
        collegeId = String(queryCollegeId);
      }
    }

    tenantStorage.run({ collegeId, role }, () => {
      next();
    });
  }
}
