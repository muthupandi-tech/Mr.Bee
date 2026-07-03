import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  async findPath(startRoomId: string, endRoomId: string) {
    const startRoom = await this.prisma.room.findUnique({ where: { id: startRoomId } });
    const endRoom = await this.prisma.room.findUnique({ where: { id: endRoomId } });

    if (!startRoom || !endRoom) {
      throw new NotFoundException('Start or end room not found.');
    }

    const startCenter = {
      x: startRoom.xCoordinate + startRoom.width / 2,
      y: startRoom.yCoordinate + startRoom.height / 2,
    };
    const endCenter = {
      x: endRoom.xCoordinate + endRoom.width / 2,
      y: endRoom.yCoordinate + endRoom.height / 2,
    };

    // Find all navigation nodes on same floors
    const startNodes = await this.prisma.navigationNode.findMany({ where: { floorId: startRoom.floorId } });
    const endNodes = await this.prisma.navigationNode.findMany({ where: { floorId: endRoom.floorId } });

    if (startNodes.length === 0 || endNodes.length === 0) {
      throw new NotFoundException('Navigation nodes not seeded on the start or end floor.');
    }

    // Find closest navigation node to start room center
    let startNode = startNodes[0];
    let minStartDistSq = Infinity;
    for (const node of startNodes) {
      const d = Math.pow(node.x - startCenter.x, 2) + Math.pow(node.y - startCenter.y, 2);
      if (d < minStartDistSq) {
        minStartDistSq = d;
        startNode = node;
      }
    }

    // Find closest navigation node to end room center
    let endNode = endNodes[0];
    let minEndDistSq = Infinity;
    for (const node of endNodes) {
      const d = Math.pow(node.x - endCenter.x, 2) + Math.pow(node.y - endCenter.y, 2);
      if (d < minEndDistSq) {
        minEndDistSq = d;
        endNode = node;
      }
    }

    // Load graph nodes and edges
    const allNodes = await this.prisma.navigationNode.findMany();
    const allEdges = await this.prisma.navigationEdge.findMany();

    // Adjacency list
    const adj = new Map<string, { toNodeId: string; distance: number }[]>();
    for (const edge of allEdges) {
      if (!adj.has(edge.fromNodeId)) {
        adj.set(edge.fromNodeId, []);
      }
      adj.get(edge.fromNodeId)!.push({ toNodeId: edge.toNodeId, distance: edge.distance });
    }

    // Dijkstra variables
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const visited = new Set<string>();

    for (const node of allNodes) {
      dist.set(node.id, Infinity);
      prev.set(node.id, null);
    }
    dist.set(startNode.id, 0);

    while (true) {
      let u: string | null = null;
      let minDist = Infinity;
      for (const nodeId of dist.keys()) {
        if (!visited.has(nodeId)) {
          const d = dist.get(nodeId)!;
          if (d < minDist) {
            minDist = d;
            u = nodeId;
          }
        }
      }

      if (!u || minDist === Infinity) break;
      if (u === endNode.id) break;

      visited.add(u);

      const neighbors = adj.get(u) || [];
      for (const edge of neighbors) {
        const v = edge.toNodeId;
        if (visited.has(v)) continue;
        const alt = dist.get(u)! + edge.distance;
        if (alt < dist.get(v)!) {
          dist.set(v, alt);
          prev.set(v, u);
        }
      }
    }

    const pathNodes: any[] = [];
    let pathFound = dist.get(endNode.id) !== Infinity;
    
    if (pathFound) {
      let curr: string | null = endNode.id;
      while (curr) {
        const nodeObj = allNodes.find((n) => n.id === curr);
        if (nodeObj) {
          pathNodes.unshift(nodeObj);
        }
        curr = prev.get(curr) || null;
      }
    }

    // Calculate full path coordinates starting at startRoom center, going through nodes, ending at endRoom center
    const fullPathPoints: { x: number; y: number; floorId: string }[] = [];
    let totalDistance = 0;

    if (startRoomId === endRoomId) {
      fullPathPoints.push({ x: startCenter.x, y: startCenter.y, floorId: startRoom.floorId });
      totalDistance = 0;
    } else if (pathFound) {
      // Start room center
      fullPathPoints.push({ x: startCenter.x, y: startCenter.y, floorId: startRoom.floorId });
      // Path nodes
      for (const node of pathNodes) {
        fullPathPoints.push({ x: node.x, y: node.y, floorId: node.floorId });
      }
      // End room center
      fullPathPoints.push({ x: endCenter.x, y: endCenter.y, floorId: endRoom.floorId });

      // Total distance = distance(startCenter, startNode) + distance(startNode, endNode) + distance(endNode, endCenter)
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

  async saveLayout(
    floorId: string,
    roomsData: any[],
    nodesData: any[],
    edgesData: any[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const floor = await tx.floor.findUnique({ where: { id: floorId } });
      if (!floor) throw new NotFoundException('Floor not found');
      const collegeId = floor.collegeId;
      // 1. Delete all existing edges that start or end at nodes belonging to this floor
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

      // 2. Delete all existing nodes of the floor
      await tx.navigationNode.deleteMany({
        where: { floorId },
      });

      // 3. Upsert / Delete rooms safely
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
        } else {
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

      // 4. Create new nodes (mapping temp IDs)
      const idMapping = new Map<string, string>();
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

      // 5. Create new edges
      const createdEdges = [];
      for (const edge of edgesData) {
        const fromId = idMapping.get(edge.fromNodeId) || edge.fromNodeId;
        const toId = idMapping.get(edge.toNodeId) || edge.toNodeId;

        if (!fromId || !toId) continue;

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
}
