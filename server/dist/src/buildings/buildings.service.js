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
exports.BuildingsService = void 0;
const common_1 = require("@nestjs/common");
const buildings_repository_1 = require("./buildings.repository");
let BuildingsService = class BuildingsService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            return await this.repository.create(dto);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Building code already exists');
            }
            throw error;
        }
    }
    async findAll() {
        return this.repository.findAll();
    }
    async findOne(id) {
        const building = await this.repository.findById(id);
        if (!building)
            throw new common_1.NotFoundException('Building not found');
        return building;
    }
    async remove(id) {
        await this.findOne(id);
        return this.repository.delete(id);
    }
};
exports.BuildingsService = BuildingsService;
exports.BuildingsService = BuildingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [buildings_repository_1.BuildingsRepository])
], BuildingsService);
//# sourceMappingURL=buildings.service.js.map