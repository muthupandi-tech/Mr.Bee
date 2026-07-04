"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("./auth/tenant.context");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super();
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.extended = this.$extends({
            query: {
                $allModels: {
                    async $allOperations({ model, operation, args, query }) {
                        const context = tenant_context_1.tenantStorage.getStore();
                        if (context && context.collegeId && context.role !== 'SUPER_ADMIN') {
                            if (model !== 'College') {
                                const anyArgs = args;
                                if (['findMany', 'findFirst', 'findUnique', 'count', 'updateMany', 'deleteMany'].includes(operation)) {
                                    anyArgs.where = anyArgs.where || {};
                                    anyArgs.where.collegeId = context.collegeId;
                                }
                                else if (operation === 'create') {
                                    anyArgs.data = anyArgs.data || {};
                                    anyArgs.data.collegeId = context.collegeId;
                                }
                                else if (operation === 'update') {
                                    anyArgs.where = anyArgs.where || {};
                                    anyArgs.where.collegeId = context.collegeId;
                                    anyArgs.data = anyArgs.data || {};
                                    anyArgs.data.collegeId = context.collegeId;
                                }
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
        }
        catch (error) {
            this.logger.error('❌ Failed to connect to PostgreSQL database. Please verify your connection string and ensure pgAdmin/PostgreSQL is running.');
            this.logger.error(error);
            process.exit(1);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Disconnected from PostgreSQL database.');
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map