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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let FloorsRepository = class FloorsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.floor.create({ data, include: { building: true } });
    }
    findAll() {
        return this.prisma.floor.findMany({ include: { building: true } });
    }
    findById(id) {
        return this.prisma.floor.findUnique({
            where: { id },
            include: {
                building: true,
                rooms: true,
                nodes: {
                    include: {
                        outgoing: true,
                    }
                }
            }
        });
    }
    findByBuilding(buildingId) {
        return this.prisma.floor.findMany({ where: { buildingId }, orderBy: { floorNumber: 'asc' } });
    }
    update(id, data) {
        return this.prisma.floor.update({ where: { id }, data });
    }
    delete(id) {
        return this.prisma.floor.delete({ where: { id } });
    }
};
exports.FloorsRepository = FloorsRepository;
exports.FloorsRepository = FloorsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FloorsRepository);
//# sourceMappingURL=floors.repository.js.map