
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const org = await prisma.organization.create({
        data: {
            name: '힙스터 메디컬 센터',
            type: 'Hospital',
            phone: '02-123-4567',
            locations: { create: { name: '본원 외래', type: 'Outpatient', floor: '3F' } }
        },
        include: { locations: true }
    })

    const doctor = await prisma.practitioner.create({
        data: { organizationId: org.id, licenseNo: 'DOC12345', name: 'Dr. Kim', specialty: '내과', phone: '010-9999-8888' }
    })

    const patient = await prisma.patient.create({
        data: { mrn: 'P0001', name: '홍길동', birthDate: new Date('1998-02-21'), sex: 'F', phone: '010-1111-2222', email: 'hong@example.com' }
    })

    const encounter = await prisma.encounter.create({
        data: { patientId: patient.id, practitionerId: doctor.id, locationId: org.locations[0].id, type: 'OPD', startAt: new Date(), reason: '건강검진' }
    })

    await prisma.observation.create({
        data: { patientId: patient.id, encounterId: encounter.id, category: 'vital', codeLoinc: '85354-9', value: '120/80', unit: 'mmHg', effectiveAt: new Date() }
    })

    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
        data: { username: 'doctor1', email: 'doc1@example.com', passwordHash }
    })

    await prisma.practitioner.update({
        where: { id: doctor.id },
        data: { user: { connect: { id: user.id } } }
    })
}

main().then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
