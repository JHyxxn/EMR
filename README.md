# 3-1.EMR

전자의무기록(EMR) 데모 모노레포.

## 폴더 구조
- `ai-gateway/`: AI 게이트웨이(Node.js Express)
- `backend/`: 백엔드(API/DB, Prisma 포함)
- `frontend/`: 프런트엔드(Vite + React + TS)

## 요구사항
- Node.js 18+
- pnpm 또는 npm

## 빠른 시작
```bash
# 루트에서
npm i -g pnpm # (선택)

# 각 워크스페이스 설치
cd ai-gateway && npm i && cd ..
cd backend && npm i && cd ..
cd frontend && npm i && cd ..
```

## 실행
```bash
# ai-gateway
cd ai-gateway && npm run start

# backend
cd backend && npm run dev

# frontend
cd frontend && npm run dev
```

## 환경변수
- 각 패키지 폴더에 `.env` 사용 (루트 .gitignore에 포함)

## 데이터베이스(backend)
- Prisma + SQLite (개발)
- 마이그레이션: `cd backend && npx prisma migrate dev`
- 시드: `cd backend && npm run seed` (있다면)

## 라이선스
MIT

