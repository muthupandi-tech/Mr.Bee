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
exports.RoomsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let RoomsRepository = class RoomsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.room.create({ data, include: { floor: true } });
    }
    findAll() {
        return this.prisma.room.findMany({ include: { floor: { include: { building: true } } } });
    }
    findById(id) {
        return this.prisma.room.findUnique({
            where: { id },
            include: { floor: { include: { building: true } }, faculty: true, events: true },
        });
    }
    findByFloor(floorId) {
        return this.prisma.room.findMany({ where: { floorId } });
    }
    search(query) {
        return this.prisma.room.findMany({
            where: {
                OR: [
                    { roomName: { contains: query } },
                    { roomNumber: { contains: query } },
                    { category: { contains: query } },
                    {
                        faculty: {
                            some: {
                                name: { contains: query }
                            }
                        }
                    }
                ]
            },
            include: {
                floor: { include: { building: true } },
                faculty: true
            }
        });
    }
    update(id, data) {
        return this.prisma.room.update({ where: { id }, data });
    }
    delete(id) {
        return this.prisma.room.delete({ where: { id } });
    }
};
exports.RoomsRepository = RoomsRepository;
exports.RoomsRepository = RoomsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsRepository);
//# sourceMappingURL=rooms.repository.js.map