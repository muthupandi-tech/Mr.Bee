import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { tenantStorage } from './auth/tenant.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public extended: any;

  constructor() {
    super();
    this.extended = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const context = tenantStorage.getStore();
            if (context && context.collegeId && context.role !== 'SUPER_ADMIN') {
              if (model !== 'College') {
                const anyArgs = args as any;
                
                // Read operations: restrict querying by collegeId
                if (['findMany', 'findFirst', 'findUnique', 'count', 'updateMany', 'deleteMany'].includes(operation)) {
                  anyArgs.where = anyArgs.where || {};
                  anyArgs.where.collegeId = context.collegeId;
                } 
                // Create operations: inject collegeId automatically
                else if (operation === 'create') {
                  anyArgs.data = anyArgs.data || {};
                  anyArgs.data.collegeId = context.collegeId;
                } 
                // Update operations: ensure we only update within tenant and keep collegeId constant
                else if (operation === 'update') {
                  anyArgs.where = anyArgs.where || {};
                  anyArgs.where.collegeId = context.collegeId;
                  anyArgs.data = anyArgs.data || {};
                  anyArgs.data.collegeId = context.collegeId;
                } 
                // Upsert operations: restrict where, and inject collegeId into create/update
                else if (operation === 'upsert') {
                  anyArgs.where = anyArgs.where || {};
                  anyArgs.where.collegeId = context.collegeId;
                  anyArgs.create = anyArgs.create || {};
                  anyArgs.create.collegeId = context.collegeId;
                  anyArgs.update = anyArgs.update || {};
                  anyArgs.update.collegeId = context.collegeId;
                }
              }
            }
            return query(args);
          }
        }
      }
    });

    // Return a proxy that forwards property lookups to the extended client
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (prop in target.extended) {
          const value = target.extended[prop];
          if (typeof value === 'function') {
            return value.bind(target.extended);
          }
          return value;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('🚀 Successfully connected to PostgreSQL database!');
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL database. Please verify your connection string and ensure pgAdmin/PostgreSQL is running.');
      this.logger.error(error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database.');
  }
}
