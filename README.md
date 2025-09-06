# 🏥 EMR (Electronic Medical Records) System

## 📋 프로젝트 개요

**EMR 시스템**은 의료진이 환자의 진료 기록을 전자적으로 관리하고, AI 기술을 활용하여 진료 과정을 지원하는 **통합 의료 정보 시스템**입니다. 

실제 병원 환경에서 사용할 수 있는 수준의 **환자 관리**, **진료 차트**, **AI 진료 지원** 기능을 제공하며, 의료진의 업무 효율성을 높이고 환자 안전을 보장하는 것을 목표로 합니다.

### 🎯 주요 목표
- **의료진 업무 효율성 향상** → 전자화된 진료 기록 관리
- **환자 안전 보장** → 정확한 의료 정보 관리 및 AI 지원
- **의료 데이터 통합** → 환자별 종합적인 의료 정보 제공
- **현대적 의료 환경 구축** → 최신 기술을 활용한 의료 시스템

---

## ✨ 주요 기능

### 👥 환자 관리 시스템
- **환자 등록/수정**: 신규 환자 등록 및 기존 환자 정보 수정
- **환자 검색/필터링**: 이름, MRN, 진료과별 검색 및 필터링
- **환자 목록 관리**: 대기 환자 및 재방문 환자 관리
- **환자 프로필**: 상세 정보, 진료 이력, 검사 결과 통합 관리

### 📊 진료 차트 시스템
- **진료 이력 추적**: 복잡한 의료 데이터 구조 및 관계 매핑
- **차트 데이터 관리**: 다양한 차트 타입 및 데이터 집계
- **이미지/파일 관리**: 의료 이미지 업로드, 처리, 저장 관리
- **진료 기록 시각화**: 차트를 통한 진료 데이터 시각화

### 🤖 AI 진료 지원
- **AI 진단 지원**: 의료 데이터 분석을 통한 진단 보조
- **약물 상호작용 검사**: 약물 간 상호작용 및 부작용 검사
- **의료 지식 기반 추천**: 의료 규칙 엔진을 통한 진료 가이드
- **자연어 처리**: 의료 기록의 자연어 분석 및 요약

### 🔒 시스템 인프라
- **사용자 인증**: JWT 기반 안전한 인증 시스템
- **권한 관리**: 역할 기반 접근 제어 및 보안 정책
- **데이터 암호화**: 민감한 의료 정보의 안전한 저장
- **배포/모니터링**: 클라우드 기반 배포 및 성능 모니터링

---

## 🛠 기술 스택

### 백엔드 (Backend)
- **Node.js**: 서버 사이드 JavaScript 런타임
- **Express.js**: 웹 애플리케이션 프레임워크
- **Prisma**: 현대적인 ORM (Object-Relational Mapping)
- **SQLite**: 개발용 경량 데이터베이스

### 프론트엔드 (Frontend)
- **React 18**: 사용자 인터페이스 라이브러리
- **TypeScript**: 타입 안전성을 위한 JavaScript 확장
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크

### AI/ML 기술
- **OpenAI API**: 자연어 처리 및 AI 모델 활용
- **AI Gateway**: AI 서비스 통합 및 관리
- **의료 데이터 분석**: 구조화된 의료 데이터 처리

### 개발 도구
- **Git**: 버전 관리 시스템
- **GitHub**: 코드 저장소 및 협업 플랫폼
- **Cursor**: AI 기반 코드 에디터
- **Notion**: 프로젝트 관리 및 문서화

---

## 🏗 아키텍처

### 마이크로서비스 구조
- **AI Gateway**: AI 서비스 통합 및 라우팅
- **Backend API**: 핵심 비즈니스 로직 및 데이터 관리
- **Frontend**: 사용자 인터페이스 및 상호작용

### 데이터 흐름
```
Frontend (React) ↔ Backend API (Node.js) ↔ Database (SQLite)
                ↕
            AI Gateway (Express) ↔ OpenAI API
```

### 보안 아키텍처
- **JWT 토큰**: 사용자 인증 및 세션 관리
- **환경 변수**: 민감한 정보의 안전한 관리
- **데이터 검증**: 입력 데이터의 유효성 검사
- **에러 처리**: 안전한 에러 처리 및 로깅

---

## 📁 프로젝트 구조

```
3-1.EMR/
├── ai-gateway/                 # AI 서비스 게이트웨이
│   ├── server.js              # AI Gateway 메인 서버
│   ├── package.json           # AI Gateway 의존성
│   └── .env                   # AI Gateway 환경 변수
├── backend/                   # 백엔드 API 서버
│   ├── index.js               # Backend 메인 서버
│   ├── prisma/                # 데이터베이스 스키마
│   │   ├── schema.prisma      # Prisma 스키마 정의
│   │   └── migrations/        # 데이터베이스 마이그레이션
│   ├── src/                   # 백엔드 소스 코드
│   └── package.json           # Backend 의존성
├── frontend/                  # 프론트엔드 React 앱
│   ├── src/                   # React 소스 코드
│   │   ├── components/        # React 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── api/               # API 클라이언트
│   │   └── hooks/             # 커스텀 훅
│   ├── public/                # 정적 파일
│   └── package.json           # Frontend 의존성
├── .gitignore                 # Git 무시 파일
├── README.md                  # 프로젝트 문서
├── SETUP.md                   # 개발 환경 설정 가이드
├── RUNNING.md                 # 실행 방법 상세 가이드
├── TEAM_WORKFLOW.md           # 팀 협업 가이드
└── LICENSE                    # MIT 라이선스
```

---

## 🚀 설치 및 실행 방법

### 요구사항
- **Node.js 18+**: JavaScript 런타임 환경
- **npm 또는 pnpm**: 패키지 관리자
- **Git**: 버전 관리 시스템

### 설치 과정

#### 1. 저장소 클론
```bash
git clone https://github.com/JHyxxn/emr-demo.git
cd 3-1.EMR
```

#### 2. 의존성 설치
```bash
# 루트에서 모든 패키지 설치
npm install

# 또는 각 워크스페이스별 설치
cd ai-gateway && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

#### 3. 환경 변수 설정
```bash
# AI Gateway 환경 변수
cp ai-gateway/.env.example ai-gateway/.env
# OpenAI API 키 등 설정

# Backend 환경 변수
cp backend/.env.example backend/.env
# 데이터베이스 연결 정보 등 설정
```

#### 4. 데이터베이스 설정
```bash
# Backend 디렉토리로 이동
cd backend

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시드 데이터 생성 (선택사항)
npm run seed
```

#### 5. 서비스 실행
```bash
# AI Gateway 실행 (터미널 1)
cd ai-gateway && npm run dev

# Backend 실행 (터미널 2)
cd backend && npm run dev

# Frontend 실행 (터미널 3)
cd frontend && npm run dev
```

#### 6. 웹 브라우저에서 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **AI Gateway**: http://localhost:5001

---

## 📚 파일별 주요 기능

### 핵심 파일 (Core Files)
- **`ai-gateway/server.js`**: AI 서비스 통합 및 라우팅을 담당하는 메인 서버
- **`backend/index.js`**: 백엔드 API 서버의 메인 진입점으로 모든 요청을 처리
- **`backend/prisma/schema.prisma`**: 데이터베이스 스키마 정의 및 모델 관리
- **`frontend/src/App.tsx`**: React 애플리케이션의 메인 컴포넌트

### 컴포넌트 파일 (Component Files)
- **`frontend/src/components/dashboard/`**: 대시보드 관련 UI 컴포넌트
- **`frontend/src/components/patient-chart/`**: 환자 차트 관련 컴포넌트
- **`frontend/src/components/patient-registration/`**: 환자 등록 관련 컴포넌트
- **`frontend/src/components/layout/`**: 레이아웃 및 네비게이션 컴포넌트

### API 파일 (API Files)
- **`frontend/src/api/patients.js`**: 환자 관련 API 클라이언트
- **`frontend/src/api/observations.js`**: 진료 기록 관련 API 클라이언트
- **`frontend/src/api/ai.js`**: AI 서비스 관련 API 클라이언트

---

## 👥 팀 협업

### 역할 분담
- **환자 관리 시스템**: 기본적인 웹 개발 
- **진료 차트 시스템**: 데이터 복잡성 관리
- **AI 진료 지원**: 의료 지식 + AI 기술
- **시스템 인프라**: 보안 및 배포 관리

### 협업 도구
- **GitHub**: 코드 저장소 및 버전 관리
- **GitHub Desktop**: GUI 기반 Git 관리
- **Notion**: 프로젝트 관리 및 일정 추적
- **Cursor**: AI 기반 코드 에디터

### 개발 워크플로우
1. **개발 환경 설정** → 각자 로컬 환경 구축
2. **개별 개발** → 담당 영역별 기능 개발
3. **코드 통합** → 팀장이 최종 코드 병합
4. **테스트 및 배포** → 통합 테스트 후 배포

---

## 📖 추가 문서

- **[SETUP.md](./SETUP.md)**: 개발 환경 설정 상세 가이드
- **[RUNNING.md](./RUNNING.md)**: 프로젝트 실행 방법 상세 가이드
- **[TEAM_WORKFLOW.md](./TEAM_WORKFLOW.md)**: 팀 협업 워크플로우 가이드
- **[Notion 프로젝트 관리](https://www.notion.so/EMR-24e0a76b1c6d802da888f80f6831890d)**: 일정 및 작업 관리

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. **Fork** → 저장소를 포크합니다
2. **Feature Branch** → 새로운 기능 브랜치를 생성합니다
3. **Commit** → 변경사항을 커밋합니다
4. **Push** → 브랜치에 푸시합니다
5. **Pull Request** → 풀 리퀘스트를 생성합니다

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 **GitHub Issues**를 통해 연락해주세요.

---

**🏥 EMR System - 현대적 의료 환경을 위한 통합 솔루션**
