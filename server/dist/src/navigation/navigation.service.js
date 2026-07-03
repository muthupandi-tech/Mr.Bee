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
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let NavigationService = class NavigationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPath(startRoomId, endRoomId) {
        const startRoom = await this.prisma.room.findUnique({ where: { id: startRoomId } });
        const endRoom = await this.prisma.room.findUnique({ where: { id: endRoomId } });
        if (!startRoom || !endRoom) {
            throw new common_1.NotFoundException('Start or end room not found.');
        }
        const startCenter = {
            x: startRoom.xCoordinate + startRoom.width / 2,
            y: startRoom.yCoordinate + startRoom.height / 2,
        };
        const endCenter = {
            x: endRoom.xCoordinate + endRoom.width / 2,
            y: endRoom.yCoordinate + endRoom.height / 2,
        };
        const startNodes = await this.prisma.navigationNode.findMany({ where: { floorId: startRoom.floorId } });
        const endNodes = await this.prisma.navigationNode.findMany({ where: { floorId: endRoom.floorId } });
        if (startNodes.length === 0 || endNodes.length === 0) {
            throw new common_1.NotFoundException('Navigation nodes not seeded on the start or end floor.');
        }
        let startNode = startNodes[0];
        let minStartDistSq = Infinity;
        for (const node of startNodes) {
            const d = Math.pow(node.x - startCenter.x, 2) + Math.pow(node.y - startCenter.y, 2);
            if (d < minStartDistSq) {
                minStartDistSq = d;
                startNode = node;
            }
        }
        let endNode = endNodes[0];
        let minEndDistSq = Infinity;
        for (const node of endNodes) {
            const d = Math.pow(node.x - endCenter.x, 2) + Math.pow(node.y - endCenter.y, 2);
            if (d < minEndDistSq) {
                minEndDistSq = d;
                endNode = node;
            }
        }
        const allNodes = await this.prisma.navigationNode.findMany();
        const allEdges = await this.prisma.navigationEdge.findMany();
        const adj = new Map();
        for (const edge of allEdges) {
            if (!adj.has(edge.fromNodeId)) {
                adj.set(edge.fromNodeId, []);
            }
            adj.get(edge.fromNodeId).push({ toNodeId: edge.toNodeId, distance: edge.distance });
        }
        const dist = new Map();
        const prev = new Map();
        const visited = new Set();
        for (const node of allNodes) {
            dist.set(node.id, Infinity);
            prev.set(node.id, null);
        }
        dist.set(startNode.id, 0);
        while (true) {
            let u = null;
            let minDist = Infinity;
            for (const nodeId of dist.keys()) {
                if (!visited.has(nodeId)) {
                    const d = dist.get(nodeId);
                    if (d < minDist) {
                        minDist = d;
                        u = nodeId;
                    }
                }
            }
            if (!u || minDist === Infinity)
                break;
            if (u === endNode.id)
                break;
            visited.add(u);
            const neighbors = adj.get(u) || [];
            for (const edge of neighbors) {
                const v = edge.toNodeId;
                if (visited.has(v))
                    continue;
                const alt = dist.get(u) + edge.distance;
                if (alt < dist.get(v)) {
                    dist.set(v, alt);
                    prev.set(v, u);
                }
            }
        }
        const pathNodes = [];
        let pathFound = dist.get(endNode.id) !== Infinity;
        if (pathFound) {
            let curr = endNode.id;
            while (curr) {
                const nodeObj = allNodes.find((n) => n.id === curr);
                if (nodeObj) {
                    pathNodes.unshift(nodeObj);
                }
                curr = prev.get(curr) || null;
            }
        }
        const fullPathPoints = [];
        let totalDistance = 0;
        if (startRoomId === endRoomId) {
            fullPathPoints.push({ x: startCenter.x, y: startCenter.y, floorId: startRoom.floorId });
            totalDistance = 0;
        }
        else if (pathFound) {
            fullPathPoints.push({ x: startCenter.x, y: startCenter.y, floorId: startRoom.floorId });
            for (const node of pathNodes) {
                fullPathPoints.push({ x: node.x, y: node.y, floorId: node.floorId });
            }
            fullPathPoints.push({ x: endCenter.x, y: endCenter.y, floorId: endRoom.floorId });
            const startToNodeDist = Math.sqrt(minStartDistSq);
            const nodeToEndDist = Math.sqrt(minEndDistSq);
            const pathDist = dist.get(endNode.id) || 0;
            totalDistance = startToNodeDist + pathDist + nodeToEndDist;
        }
        return {
            startRoom,
            endRoom,
            distance: Math.round(totalDistance * 100) / 100,
            path: pathNodes,
            fullPathPoints,
        };
    }
    async saveLayout(floorId, roomsData, nodesData, edgesData) {
        return this.prisma.$transaction(async (tx) => {
            const floor = await tx.floor.findUnique({ where: { id: floorId } });
            if (!floor)
                throw new common_1.NotFoundException('Floor not found');
            const collegeId = floor.collegeId;
            const existingNodes = await tx.navigationNode.findMany({
                where: { floorId },
                select: { id: true },
            });
            const nodeIds = existingNodes.map((n) => n.id);
            await tx.navigationEdge.deleteMany({
                where: {
                    OR: [
                        { fromNodeId: { in: nodeIds } },
                        { toNodeId: { in: nodeIds } },
                    ],
                },
            });
            await tx.navigationNode.deleteMany({
                where: { floorId },
            });
            const existingRooms = await tx.room.findMany({ where: { floorId } });
            const existingRoomIds = existingRooms.map((r) => r.id);
            const incomingRoomIds = roomsData
                .map((r) => r.id)
                .filter((id) => id && id.includes('-'));
            const roomsToDelete = existingRoomIds.filter((id) => !incomingRoomIds.includes(id));
            await tx.room.deleteMany({ where: { id: { in: roomsToDelete } } });
            const createdOrUpdatedRooms = [];
            for (const room of roomsData) {
                const isExisting = room.id && room.id.includes('-') && existingRoomIds.includes(room.id);
                const roomPayload = {
                    roomNumber: room.roomNumber,
                    roomName: room.roomName,
                    category: room.category,
                    capacity: room.capacity ? parseInt(room.capacity) : null,
                    xCoordinate: parseFloat(room.xCoordinate),
                    yCoordinate: parseFloat(room.yCoordinate),
                    width: parseFloat(room.width),
                    height: parseFloat(room.height),
                    rotation: room.rotation ? parseFloat(room.rotation) : 0,
                };
                if (isExisting) {
                    const r = await tx.room.update({
                        where: { id: room.id },
                        data: roomPayload,
                    });
                    createdOrUpdatedRooms.push(r);
                }
                else {
                    const r = await tx.room.create({
                        data: {
                            collegeId,
                            ...roomPayload,
                            id: room.id && room.id.includes('-') ? room.id : undefined,
                            floorId,
                        },
                    });
                    createdOrUpdatedRooms.push(r);
                }
            }
            const idMapping = new Map();
            const createdNodes = [];
            for (const node of nodesData) {
                const n = await tx.navigationNode.create({
                    data: {
                        collegeId,
                        x: parseFloat(node.x),
                        y: parseFloat(node.y),
                        floorId,
                    },
                });
                idMapping.set(node.id, n.id);
                createdNodes.push(n);
            }
            const createdEdges = [];
            for (const edge of edgesData) {
                const fromId = idMapping.get(edge.fromNodeId) || edge.fromNodeId;
                const toId = idMapping.get(edge.toNodeId) || edge.toNodeId;
                if (!fromId || !toId)
                    continue;
                const e = await tx.navigationEdge.create({
                    data: {
                        collegeId,
                        fromNodeId: fromId,
                        toNodeId: toId,
                        distance: parseFloat(edge.distance) || 1,
                    },
                });
                createdEdges.push(e);
            }
            return {
                success: true,
                roomsCount: createdOrUpdatedRooms.length,
                nodesCount: createdNodes.length,
                edgesCount: createdEdges.length,
            };
        });
    }
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NavigationService);
//# sourceMappingURL=navigation.service.js.map