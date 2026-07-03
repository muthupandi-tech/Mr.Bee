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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const rooms_repository_1 = require("./rooms.repository");
let RoomsService = class RoomsService {
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return this.repo.create(dto);
    }
    findAll(search) {
        if (search)
            return this.repo.search(search);
        return this.repo.findAll();
    }
    findByFloor(floorId) { return this.repo.findByFloor(floorId); }
    async findOne(id) {
        const room = await this.repo.findById(id);
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    async remove(id) {
        await this.findOne(id);
        return this.repo.delete(id);
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rooms_repository_1.RoomsRepository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map