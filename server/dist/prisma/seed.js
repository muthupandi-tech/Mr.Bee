"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Campus Navigator database (Multi-Tenant)...');
    await prisma.college.deleteMany();
    const mitCollege = await prisma.college.create({
        data: {
            name: 'Massachusetts Institute of Technology',
            domain: 'mit',
        },
    });
    console.log(`Created College: ${mitCollege.name}`);
    const passwordHash = await bcrypt.hash('password123', 10);
    const superAdmin = await prisma.user.create({
        data: {
            fullName: 'Super Admin',
            email: 'superadmin@campus.edu',
            password: passwordHash,
            role: client_1.Role.SUPER_ADMIN,
        },
    });
    const collegeAdmin = await prisma.user.create({
        data: {
            collegeId: mitCollege.id,
            fullName: 'MIT Admin',
            email: 'admin@mit.edu',
            password: passwordHash,
            role: client_1.Role.COLLEGE_ADMIN,
        },
    });
    const studentOne = await prisma.user.create({
        data: {
            collegeId: mitCollege.id,
            fullName: 'Student One',
            email: 'student@mit.edu',
            password: passwordHash,
            role: client_1.Role.STUDENT,
        },
    });
    console.log('Created Users');
    const seb = await prisma.building.create({
        data: {
            collegeId: mitCollege.id,
            name: 'Science & Engineering Block',
            code: 'SEB',
            description: 'Main block for computing and sciences.',
        },
    });
    const sebFloor0 = await prisma.floor.create({
        data: {
            collegeId: mitCollege.id,
            buildingId: seb.id,
            floorNumber: 0,
            floorName: 'Ground Floor',
        },
    });
    console.log('Created Building and Floor');
    const cseDept = await prisma.department.create({
        data: {
            collegeId: mitCollege.id,
            name: 'Computer Science',
            code: 'CSE',
        },
    });
    const facultyAlan = await prisma.faculty.create({
        data: {
            collegeId: mitCollege.id,
            name: 'Dr. Alan Turing',
            designation: 'HOD',
            departmentId: cseDept.id,
        },
    });
    console.log('Created Department and Faculty');
    const aiLab = await prisma.room.create({
        data: {
            collegeId: mitCollege.id,
            floorId: sebFloor0.id,
            roomNumber: '101',
            roomName: 'AI Laboratory',
            category: 'LAB',
            capacity: 50,
            xCoordinate: 100,
            yCoordinate: 100,
            width: 150,
            height: 120,
        },
    });
    const cseClass = await prisma.room.create({
        data: {
            collegeId: mitCollege.id,
            floorId: sebFloor0.id,
            roomNumber: '102',
            roomName: 'CSE Lecture Hall',
            category: 'CLASSROOM',
            capacity: 60,
            xCoordinate: 300,
            yCoordinate: 100,
            width: 120,
            height: 120,
        },
    });
    await prisma.faculty.update({
        where: { id: facultyAlan.id },
        data: { roomId: aiLab.id },
    });
    console.log('Created Rooms');
    const nodeA = await prisma.navigationNode.create({
        data: { collegeId: mitCollege.id, floorId: sebFloor0.id, x: 175, y: 250 },
    });
    const nodeB = await prisma.navigationNode.create({
        data: { collegeId: mitCollege.id, floorId: sebFloor0.id, x: 360, y: 250 },
    });
    await prisma.navigationEdge.createMany({
        data: [
            { collegeId: mitCollege.id, fromNodeId: nodeA.id, toNodeId: nodeB.id, distance: 185 },
            { collegeId: mitCollege.id, fromNodeId: nodeB.id, toNodeId: nodeA.id, distance: 185 },
        ]
    });
    console.log('Created Navigation Graph');
    await prisma.event.create({
        data: {
            collegeId: mitCollege.id,
            title: 'Hackathon 2026',
            roomId: aiLab.id,
            startTime: new Date('2026-08-15T09:00:00Z'),
            endTime: new Date('2026-08-16T17:00:00Z'),
        },
    });
    await prisma.announcement.create({
        data: {
            collegeId: mitCollege.id,
            title: 'Welcome to Campus Navigator',
            description: 'The new multi-tenant indoor mapping system is now live.',
        },
    });
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map