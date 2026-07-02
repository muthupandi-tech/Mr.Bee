"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma.service");
const health_module_1 = require("./health/health.module");
const buildings_module_1 = require("./buildings/buildings.module");
const floors_module_1 = require("./floors/floors.module");
const rooms_module_1 = require("./rooms/rooms.module");
const departments_module_1 = require("./departments/departments.module");
const faculty_module_1 = require("./faculty/faculty.module");
const events_module_1 = require("./events/events.module");
const announcements_module_1 = require("./announcements/announcements.module");
const navigation_module_1 = require("./navigation/navigation.module");
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            health_module_1.HealthModule,
            buildings_module_1.BuildingsModule,
            floors_module_1.FloorsModule,
            rooms_module_1.RoomsModule,
            departments_module_1.DepartmentsModule,
            faculty_module_1.FacultyModule,
            events_module_1.EventsModule,
            announcements_module_1.AnnouncementsModule,
            navigation_module_1.NavigationModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map