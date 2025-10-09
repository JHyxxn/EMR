// backend/index.js (ESM)
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import drugDatabase from './src/drugDatabase.js'

// ---------- 공통 임계치 규칙 ----------
function calcFlagsForObservation(obs) {
    const flags = []
    if (obs.codeLoinc === 'BP-SYS') {
        const v = Number(obs.value)
        if (!Number.isNaN(v) && v >= 140) flags.push('HIGH_BP_SYSTOLIC')
    }
    if (obs.codeLoinc === 'BP-DIA') {
        const v = Number(obs.value)
        if (!Number.isNaN(v) && v >= 90) flags.push('HIGH_BP_DIASTOLIC')
    }
    if (obs.codeLoinc === 'GLU-FBS') {
        const v = Number(obs.value)
        if (!Number.isNaN(v) && v >= 200) flags.push('HIGH_GLUCOSE')
    }
    if (obs.codeLoinc === 'HR') {
        const v = Number(obs.value)
        if (!Number.isNaN(v) && v >= 120) flags.push('HIGH_HEART_RATE')
    }
    return flags
}

const app = express()
const prisma = new PrismaClient()

// CORS 설정 - 프론트엔드 도메인 허용
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true
}))

app.use(express.json())

const PORT = Number(process.env.PORT ?? 4000)
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10)
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

// ===== 공통 prefix 라우터 =====
const api = express.Router()

api.get('/health', (_req, res) =>
    res.json({ ok: true, service: 'emr-backend' })
)

// 유저 목록
api.get('/users', async (_req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, status: true, createdAt: true }
    })
    res.json(users)
})

// 유저 생성
api.post('/users', async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !password)
        return res.status(400).json({ error: 'username and password are required' })

    const exists = await prisma.user.findUnique({ where: { username } })
    if (exists) return res.status(409).json({ error: 'username already exists' })

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await prisma.user.create({
        data: { username, email, passwordHash, status: 'active' },
        select: { id: true, username: true, email: true, status: true, createdAt: true }
    })
    res.status(201).json(user)
})

// 로그인
api.post('/auth/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ error: 'username and password required' })

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(401).json({ error: 'invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash ?? '')
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: '12h' })
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, status: user.status } })
})

// 토큰으로 내 정보
api.get('/me', async (req, res) => {
    try {
        const auth = req.headers.authorization || ''
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
        const payload = jwt.verify(token, JWT_SECRET)
        const me = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, username: true, email: true, status: true }
        })
        res.json(me)
    } catch {
        res.status(401).json({ error: 'unauthorized' })
    }
})

app.use('/api', api)

// AI 게이트웨이 헬스 프록시
app.get('/api/ai/health', async (_req, res) => {
    try {
        const r = await fetch(`${process.env.AI_GATEWAY_URL ?? 'http://localhost:5001'}/health`)
        const data = await r.json()
        res.status(r.status).json(data)
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'ai_gateway_unreachable' })
    }
})

app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`))

// ========== Patients ==========
app.post('/api/patients', async (req, res) => {
    try {
        const { mrn, name, birthDate, sex, phone, email, address } = req.body
        if (!mrn || !name) return res.status(400).json({ error: 'mrn and name are required' })

        const created = await prisma.patient.create({
            data: { mrn, name, birthDate: birthDate ? new Date(birthDate) : null, sex, phone, email, address },
            select: { id: true, mrn: true, name: true, birthDate: true, sex: true, phone: true, email: true, address: true }
        })
        res.json(created)
    } catch (e) {
        if (e.code === 'P2002') return res.status(409).json({ error: 'mrn already exists' })
        console.error(e)
        res.status(500).json({ error: 'server_error' })
    }
})

app.get('/api/patients', async (req, res) => {
    const { query } = req.query
    const where = query
        ? { OR: [{ name: { contains: String(query) } }, { mrn: { contains: String(query) } }] }
        : {}
    const list = await prisma.patient.findMany({
        where,
        orderBy: { id: 'desc' },
        select: { id: true, mrn: true, name: true, birthDate: true, sex: true, phone: true, email: true, address: true }
    })
    res.json(list)
})

app.get('/api/patients/:id', async (req, res) => {
    const id = Number(req.params.id)
    const patient = await prisma.patient.findUnique({
        where: { id },
        include: { encounters: { take: 5, orderBy: { startAt: 'desc' } } }
    })
    if (!patient) return res.status(404).json({ error: 'not_found' })
    res.json(patient)
})

// ========== Observations ==========
app.post('/api/observations', async (req, res) => {
    try {
        const { patientId, encounterId, category, codeLoinc, value, unit, effectiveAt } = req.body
        if (!patientId || !category || !codeLoinc || value === undefined) {
            return res.status(400).json({ error: 'patientId, category, codeLoinc, value are required' })
        }

        const flags = calcFlagsForObservation({ category, codeLoinc, value, unit })

        const created = await prisma.observation.create({
            data: {
                patientId: Number(patientId),
                encounterId: encounterId ? Number(encounterId) : null,
                category,
                codeLoinc,
                value: String(value),
                unit: unit || null,
                effectiveAt: effectiveAt ? new Date(effectiveAt) : new Date()
            },
            select: { id: true, patientId: true, category: true, codeLoinc: true, value: true, unit: true, effectiveAt: true }
        })

        res.json({ ...created, flags })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'server_error' })
    }
})

app.get('/api/observations/latest/:patientId', async (req, res) => {
    const patientId = Number(req.params.patientId)
    const items = await prisma.observation.findMany({
        where: { patientId },
        orderBy: { effectiveAt: 'desc' },
        take: 50,
        select: { id: true, category: true, codeLoinc: true, value: true, unit: true, effectiveAt: true }
    })
    const withFlags = items.map(o => ({ ...o, flags: calcFlagsForObservation(o) }))
    res.json(withFlags)
})

// ========== Alerts ==========
app.get('/api/alerts/patient/:id', async (req, res) => {
    const id = Number(req.params.id)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const list = await prisma.observation.findMany({
        where: { patientId: id, effectiveAt: { gte: since } },
        orderBy: { effectiveAt: 'desc' },
        select: { id: true, category: true, codeLoinc: true, value: true, unit: true, effectiveAt: true }
    })

    const flagged = list.map(o => ({ ...o, flags: calcFlagsForObservation(o) })).filter(o => o.flags.length > 0)

    const summary = flagged.map(f => ({
        code: f.codeLoinc,
        value: f.value,
        unit: f.unit,
        flags: f.flags,
        at: f.effectiveAt
    }))

    res.json({ hasAlert: summary.length > 0, count: summary.length, summary })
})

// ========== Drug Database APIs ==========
// 약물 검색
app.get('/api/drugs/search', (req, res) => {
    try {
        const { query } = req.query
        if (!query) {
            return res.status(400).json({ error: 'query parameter is required' })
        }

        const results = drugDatabase.searchDrugs(query)
        res.json({
            query,
            results,
            total: results.length
        })
    } catch (error) {
        console.error('약물 검색 오류:', error)
        res.status(500).json({ error: 'drug_search_failed' })
    }
})

// 약물 상호작용 검사
app.post('/api/drugs/interactions', (req, res) => {
    try {
        const { medications, patient } = req.body
        if (!medications || !Array.isArray(medications)) {
            return res.status(400).json({ error: 'medications array is required' })
        }

        const interactionCheck = drugDatabase.checkDrugInteractions(medications)
        res.json(interactionCheck)
    } catch (error) {
        console.error('약물 상호작용 검사 오류:', error)
        res.status(500).json({ error: 'interaction_check_failed' })
    }
})

// 처방 가이드 생성
app.post('/api/drugs/prescription-guide', (req, res) => {
    try {
        const { medications, patient } = req.body
        if (!medications || !Array.isArray(medications)) {
            return res.status(400).json({ error: 'medications array is required' })
        }

        const guide = drugDatabase.generatePrescriptionGuide(medications, patient)
        res.json(guide)
    } catch (error) {
        console.error('처방 가이드 생성 오류:', error)
        res.status(500).json({ error: 'prescription_guide_failed' })
    }
})

// 약물 데이터베이스 상태
app.get('/api/drugs/status', (req, res) => {
    try {
        const status = drugDatabase.getStatus()
        res.json(status)
    } catch (error) {
        console.error('약물 데이터베이스 상태 확인 오류:', error)
        res.status(500).json({ error: 'status_check_failed' })
    }
})

// ========== AI 프록시 (쿼리 그대로 전달) ==========
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'http://localhost:5001'

// 임상노트 요약 프록시
app.post('/api/ai/clinical-note', async (req, res) => {
    try {
        const url = new URL(`${AI_GATEWAY_URL}/insight/clinical-note`)
        Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v))) // provider=llm 등 전달

        const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        const data = await r.json()
        res.status(r.status).json(data)
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'ai_gateway_unavailable' })
    }
})

// Lab 요약 프록시
app.post('/api/ai/lab-summary', async (req, res) => {
    try {
        const url = new URL(`${AI_GATEWAY_URL}/insight/lab-summary`)
        Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v)))

        const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        const data = await r.json()
        res.status(r.status).json(data)
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'ai_gateway_unavailable' })
    }
})

// 증상 분석 AI 프록시
app.post('/api/ai/symptom-analysis', async (req, res) => {
    try {
        const url = new URL(`${AI_GATEWAY_URL}/insight/symptom-analysis`)
        Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v)))

        const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        const data = await r.json()
        res.status(r.status).json(data)
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'ai_gateway_unavailable' })
    }
})

// 처방 가이드 프록시
app.post('/api/ai/prescription-guide', async (req, res) => {
    try {
        const url = new URL(`${AI_GATEWAY_URL}/insight/prescription-guide`)
        Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v)))

        const r = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        })
        const data = await r.json()
        res.status(r.status).json(data)
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'ai_gateway_unavailable' })
    }
})

// AI 모델 상태 확인 프록시
app.get('/api/ai/models/status', async (req, res) => {
    try {
        const r = await fetch(`${AI_GATEWAY_URL}/models/status`)
        const data = await r.json()
        res.status(r.status).json(data)
    } catch (e) {
        console.error(e)
        res.status(502).json({ error: 'ai_gateway_unavailable' })
    }
})