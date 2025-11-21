# 🏥 EMR (Electronic Medical Records) System

## 📋 이 시스템이 뭔가요?
이 시스템은 병원에서 의료진이 환자의 진료 기록을 전자적으로 관리할 수 있게 해주는 프로그램입니다.
실제 병원에서 사용할 수 있는 수준의 기능들을 제공하며, AI(인공지능) 기술을 활용하여 의료진의 업무를 도와줍니다.


## 🎯 왜 만들었나요?
- 의료진의 업무 효율성 향상
- 환자 안전 보장 (정확한 의료 정보 관리)
- 의료 데이터 통합 관리
- 현대적인 의료 환경 구축


## 🛠 기술 스택

### AI-Gateway (김지현 담당)
**개념**: 인공지능을 활용하여 의료진을 도와주는 기술들
- **JavaScript/TypeScript**: AI 로직 구현 언어
- **조건부 렌더링**: 검사 결과에 따른 시각적 표시
- **데이터 시뮬레이션**: AI 분석 결과 시뮬레이션
- **로컬 데이터 처리**: 약물 상호작용 검증 로직

### Backend (이윤효 담당)
**개념**: 웹사이트의 "뒷부분"을 담당하는 기술들
- **Node.js**: JavaScript로 서버를 만드는 기술
- **Express.js**: 웹 애플리케이션을 쉽게 만들 수 있게 해주는 도구
- **SQLite**: 경량 데이터베이스 (개발용)
- **RESTful API**: 프론트엔드와 백엔드를 연결하는 통신 시스템

### Frontend (이희창 담당)
**개념**: 의료진이 실제로 사용하는 화면을 만드는 기술들
- **React 18**: 사용자 인터페이스를 만드는 라이브러리
- **TypeScript**: JavaScript에 타입 안전성을 추가한 언어
- **CSS3 (Grid, Flexbox)**: 레이아웃을 구성하는 스타일링 기술
- **Local Storage**: 브라우저에 데이터를 저장하는 기술

### Downloads (김종원 담당)
**개념**: 시스템에 필요한 데이터를 수집하고 관리하는 기술들
- **Python 3.x**: 데이터 처리 및 분석 언어
- **pandas 라이브러리**: 데이터 정제 및 변환 도구
- **CSV/JSON 파일 처리**: 데이터 파일 읽기 및 쓰기
- **데이터 검증**: 수집한 데이터의 정확성 확인

### 개발 도구
**개념**: 개발을 도와주는 도구들
- **Git**: 코드 버전 관리 시스템
- **GitHub**: 코드 저장소 및 협업 플랫폼
- **Vite**: 빠른 개발 서버 및 빌드 도구


## 📁 담당자별 주요 파일 목록 (질의응답 참고용)

### 이희창 (프론트엔드) 담당 파일

#### 핵심 컴포넌트
- **`frontend/src/components/dashboard/Dashboard.tsx`**
  - 대시보드 메인 컴포넌트
  - 금일 대기 환자 목록 관리
  - 진료 시작/완료 버튼 동작
  - 실시간 시간 표시 및 운영시간 관리
  - 환자 상태 관리 (대기 중, 진료 중, 완료)

- **`frontend/src/components/auth/SearchBar.tsx`**
  - 환자 검색바 컴포넌트
  - 실시간 검색 기능
  - 검색 결과 드롭다운 표시

- **`frontend/src/pages/PatientChart.tsx`**
  - 재진환자 차트 페이지
  - 환자 검색 및 선택
  - 이전 진료 기록 조회
  - 대기 목록에 재진환자 추가

- **`frontend/src/pages/ExamManagement.tsx`**
  - 검사 관리 페이지
  - 검사 오더 관리
  - 검사 결과 입력
  - AI 기반 검사 결과 분석

- **`frontend/src/components/patient-chart/PatientChartModal.tsx`**
  - 진료 차트 모달 컴포넌트
  - SOAP 진료 기록 작성
  - 처방 및 검사 오더 입력
  - AI 임상노트 요약 연동

- **`frontend/src/components/patient-registration/NewPatientModal.tsx`**
  - 신규 환자 등록 모달
  - 환자 기본 정보 입력
  - 바이탈 사인 입력
  - 대기 목록에 환자 추가

#### 상태 관리 및 유틸리티
- **`frontend/src/App.tsx`**
  - 메인 애플리케이션 컴포넌트
  - 페이지 라우팅 관리
  - 전역 상태 관리
  - 인증 관리

- **`frontend/src/hooks/`** (전체 디렉토리)
  - Context API를 통한 전역 상태 관리
  - 환자 데이터 관리
  - 네비게이션 상태 관리

### 이윤효 (백엔드) 담당 파일

#### 서버 및 API
- **`backend/index.js`**
  - FastAPI 백엔드 서버 메인 파일
  - 환자 데이터 CRUD API
  - 검사 정보 관리 API
  - 문서 관리 API
  - 처방 관리 API
  - AI Gateway 프록시
  - 관찰치(Observation) 관리 및 임계치 플래그 계산

#### 데이터베이스 및 관리 모듈
- **`backend/src/documentManagement.js`**
  - 문서 관리 시스템
  - 소견서, 진료 보고서, 처방전, 검사 요청서 자동 생성
  - 템플릿 기반 문서 생성

- **`backend/src/testManagement.js`**
  - 검사 관리 시스템
  - 검사 요청 생성 및 일정 관리
  - 검사 결과 입력 및 통계

- **`backend/src/prescriptionManagement.js`**
  - 처방 관리 시스템
  - 처방전 생성 및 저장
  - 약물 상호작용 검사
  - 처방 이력 조회

#### 데이터베이스 스키마
- **`backend/prisma/schema.prisma`**
  - Prisma 데이터베이스 스키마
  - 환자, 진료기록, 관찰치 등 테이블 정의

### 김종원 (데이터 생성) 담당 파일

#### 데이터 생성기
- **`backend/src/patientDataGenerator50.js`**
  - 환자 데이터 생성기 (50명 + 대기 환자 15명)
  - 환자 기본 정보 생성
  - 진료 이력 생성
  - 알레르기 정보 생성
  - JSON 파일 저장

- **`backend/src/patientDataGenerator.js`**
  - 기본 환자 데이터 생성기

- **`backend/src/patientDataGeneratorWithDuplicates.js`**
  - 중복 환자 데이터 생성기

#### 데이터 파일
- **`backend/patient_data_50_with_waiting.json`**
  - 생성된 환자 데이터 (50명 + 대기 환자 15명)

- **`Downloads/drug_dataset_500.json`**
  - 약물 데이터베이스 (500개 약물 정보)

### 김지현 (AI Gateway) 담당 파일

#### AI Gateway 서버
- **`ai-gateway/server.js`**
  - AI Gateway 메인 서버
  - 다중 AI 모델 통합 (OpenAI, Anthropic, Google)
  - 자동 폴백 메커니즘
  - Rate Limit 관리
  - 임상노트 요약, 증상 분석, 처방 가이드 등 AI 기능

#### AI 관련 프론트엔드 컴포넌트
- **`frontend/src/api/ai.js`**
  - AI Gateway API 클라이언트
  - 임상노트 요약, 증상 분석, 처방 가이드 등 API 호출

- **`frontend/src/components/ai-support/PrescriptionGuideModal.tsx`**
  - AI 처방 가이드 모달
  - 약물 상호작용 검사
  - 용량 가이드 생성

- **`frontend/src/components/ai-support/SymptomAnalysisModal.tsx`**
  - AI 증상 분석 모달
  - 진단 추천 기능

- **`frontend/src/components/patient-chart/MedicalOpinionModal.tsx`**
  - 소견서 발급 모달
  - 소견서 자동 생성 및 편집

#### 약물 데이터베이스
- **`backend/src/drugDatabase.js`**
  - 약물 데이터베이스 관리 모듈
  - 약물 검색 및 상호작용 검사
  - 처방 가이드 생성

---

## 🔨 담당자별 개발 순서 및 파일 구조

### 이희창 (프론트엔드) 개발 순서

#### 1단계: 기반 구조 설정
```
frontend/src/
├── design/tokens.js          # 디자인 토큰 (색상, 간격 등)
├── types/index.ts            # TypeScript 타입 정의
└── utils/                     # 유틸리티 함수
    ├── validation.ts         # 폼 유효성 검사
    └── mrnGenerator.ts      # MRN 생성기
```

#### 2단계: 데이터 및 상태 관리
```
frontend/src/
├── data/                      # 정적 데이터
│   ├── waitingPatientsData.ts    # 대기 환자 데이터
│   ├── patientHistoryData.ts     # 환자 이력 데이터
│   ├── revisitPatientsData.ts    # 재진 환자 데이터
│   └── patients.ts               # 환자 기본 데이터
└── hooks/                     # Context API 상태 관리
    ├── authStore.jsx          # 인증 상태
    ├── patientStore.jsx       # 환자 상태
    └── navigationStore.jsx    # 네비게이션 상태
```

#### 3단계: 공통 컴포넌트
```
frontend/src/components/
└── common/                    # 재사용 가능한 공통 컴포넌트
    ├── Button.jsx
    ├── Input.jsx
    ├── TextArea.jsx
    ├── Card.jsx
    └── Tabs.jsx
```

#### 4단계: 레이아웃 컴포넌트
```
frontend/src/components/
└── layout/                    # 레이아웃 컴포넌트
    ├── Header.tsx            # 상단 헤더 (검색바 포함)
    └── Sidebar.tsx           # 좌측 사이드바
```

#### 5단계: 기능별 컴포넌트
```
frontend/src/components/
├── auth/                      # 인증 관련
│   ├── LoginModal.tsx
│   └── SearchBar.tsx         # 환자 검색바
├── dashboard/                 # 대시보드 컴포넌트
│   ├── Dashboard.tsx         # 메인 대시보드
│   ├── AlertsSection.tsx     # 알림 섹션
│   ├── Calendar.tsx          # 캘린더
│   └── QuickActions.tsx      # 빠른 액션
├── patient-registration/      # 환자 등록
│   ├── NewPatientModal.tsx   # 신규 환자 등록
│   ├── RevisitPatientModal.tsx # 재진 환자 등록
│   ├── PatientBasicInfo.tsx  # 기본 정보 입력
│   └── VitalInput.tsx        # 바이탈 입력
└── patient-chart/            # 환자 차트
    ├── PatientChartModal.tsx  # 진료 차트 모달
    ├── MedicalOpinionModal.tsx # 소견서 모달
    └── VisitHistoryModal.tsx  # 방문 이력 모달
```

#### 6단계: 페이지 컴포넌트
```
frontend/src/pages/
├── Dashboard.jsx             # 대시보드 페이지
├── PatientChart.tsx          # 환자 차트 페이지
├── ExamManagement.tsx        # 검사 관리 페이지
└── DocumentManagement.tsx    # 문서 관리 페이지
```

#### 7단계: API 연동
```
frontend/src/api/
├── client.js                  # API 클라이언트 기본 설정
├── index.js                   # API 모듈 통합 export
├── patients.js                # 환자 API
├── ai.js                      # AI Gateway API
└── auth.js                    # 인증 API
```

#### 8단계: 메인 앱 통합
```
frontend/src/
├── App.tsx                    # 메인 애플리케이션 컴포넌트
└── main.tsx                   # 앱 진입점
```

**개발 순서 요약:**
1. 디자인 토큰 및 타입 정의 → 2. 데이터 및 상태 관리 → 3. 공통 컴포넌트 → 4. 레이아웃 → 5. 기능별 컴포넌트 → 6. 페이지 → 7. API 연동 → 8. 통합

---

### 이윤효 (백엔드) 개발 순서

#### 1단계: 데이터베이스 스키마 설계
```
backend/prisma/
├── schema.prisma             # Prisma 스키마 정의
│   ├── User 모델
│   ├── Patient 모델
│   ├── Encounter 모델
│   └── Observation 모델
└── migrations/               # 데이터베이스 마이그레이션
    ├── 20250818073029_add_user/
    └── 20250819055332_init_emr/
```

#### 2단계: 관리 모듈 개발
```
backend/src/
├── documentManagement.js     # 문서 관리 시스템
│   ├── 소견서 생성
│   ├── 진료 보고서 생성
│   ├── 처방전 생성
│   └── 검사 요청서 생성
├── testManagement.js         # 검사 관리 시스템
│   ├── 검사 요청 생성
│   ├── 검사 일정 관리
│   └── 검사 결과 입력
└── prescriptionManagement.js # 처방 관리 시스템
    ├── 처방전 생성
    ├── 약물 상호작용 검사
    └── 처방 이력 관리
```

#### 3단계: 약물 데이터베이스 연동
```
backend/src/
└── drugDatabase.js           # 약물 데이터베이스 관리
    ├── 약물 검색
    ├── 상호작용 검사
    └── 처방 가이드 생성
```

#### 4단계: 메인 서버 구축
```
backend/
└── index.js                  # FastAPI 백엔드 서버
    ├── Express.js 설정
    ├── CORS 설정
    ├── 환자 CRUD API
    ├── 관찰치(Observation) API
    ├── 문서 관리 API
    ├── 검사 관리 API
    ├── 처방 관리 API
    └── AI Gateway 프록시
```

**개발 순서 요약:**
1. 데이터베이스 스키마 설계 → 2. 관리 모듈 개발 → 3. 약물 데이터베이스 연동 → 4. 메인 서버 구축 및 API 통합

---

### 김종원 (데이터 생성) 개발 순서

#### 1단계: 기본 데이터 생성기
```
backend/src/
└── patientDataGenerator.js   # 기본 환자 데이터 생성기
    ├── 환자 기본 정보 생성
    ├── 랜덤 데이터 생성 함수
    └── JSON 파일 저장
```

#### 2단계: 확장 데이터 생성기
```
backend/src/
├── patientDataGeneratorWithDuplicates.js  # 중복 환자 포함 생성기
└── patientDataGenerator50.js              # 50명 + 대기 환자 15명 생성기
    ├── 50명 환자 데이터 생성
    ├── 금일 대기 환자 15명 생성
    ├── 진료 이력 생성
    ├── 알레르기 정보 생성
    └── 통계 정보 생성
```

#### 3단계: 데이터 파일 생성
```
backend/
└── patient_data_50_with_waiting.json      # 생성된 환자 데이터

Downloads/
└── drug_dataset_500.json                  # 약물 데이터베이스 (500개)
```

**개발 순서 요약:**
1. 기본 데이터 생성기 → 2. 확장 데이터 생성기 (50명 + 대기 환자) → 3. 데이터 파일 생성 및 검증

---

### 김지현 (AI Gateway) 개발 순서

#### 1단계: AI Gateway 서버 기본 구조
```
ai-gateway/
├── server.js                 # Express.js 서버 설정
│   ├── CORS 설정
│   ├── Rate Limit 관리
│   └── 기본 라우팅
└── package.json              # 의존성 관리
```

#### 2단계: 다중 AI 모델 통합
```
ai-gateway/server.js
├── AI 모델 설정 (OpenAI, Anthropic, Google)
├── LLM 호출 함수
│   ├── callOpenAI()
│   ├── callAnthropic()
│   └── callGoogle()
└── 통합 LLM 호출 함수 (자동 폴백)
    └── callLLM()
```

#### 3단계: AI 인사이트 기능 개발
```
ai-gateway/server.js
├── /insight/clinical-note    # 임상노트 요약
├── /insight/lab-summary      # Lab/바이탈 요약
├── /insight/symptom-analysis # 증상 분석
├── /insight/prescription-guide # 처방 가이드
└── /insight/test-analysis    # 검사 결과 분석
```

#### 4단계: 프론트엔드 API 클라이언트
```
frontend/src/api/
└── ai.js                     # AI Gateway API 클라이언트
    ├── clinicalNote()
    ├── labSummary()
    ├── symptomAnalysis()
    └── prescriptionGuide()
```

#### 5단계: AI 지원 컴포넌트
```
frontend/src/components/ai-support/
├── PrescriptionGuideModal.tsx  # 처방 가이드 모달
└── SymptomAnalysisModal.tsx    # 증상 분석 모달
```

#### 6단계: 약물 데이터베이스 연동
```
backend/src/
└── drugDatabase.js           # 약물 데이터베이스 관리
    ├── 약물 검색
    ├── 상호작용 검사
    └── 처방 가이드 생성
```

**개발 순서 요약:**
1. AI Gateway 서버 기본 구조 → 2. 다중 AI 모델 통합 → 3. AI 인사이트 기능 개발 → 4. 프론트엔드 API 클라이언트 → 5. AI 지원 컴포넌트 → 6. 약물 데이터베이스 연동


## 📝 발표 시 추가 팁

### 화면 전환 가이드
- **대시보드 → 차트**: 좌측 메뉴의 "차트" 클릭
- **대시보드 → 검사 관리**: 좌측 메뉴의 "검사" 클릭
- **대시보드 → 문서 관리**: 좌측 메뉴의 "서식" 클릭

### 시간 활용
- 화면 상단의 **"현재 시간 09:59"**를 활용하여 시스템이 실시간으로 작동하고 있음을 강조
- **"미완료/최근알림"** 섹션도 시스템의 실시간 알림 기능을 보여주는 데 활용

### 자연스러운 전환
- 각 시연마다 해당 기능을 담당하는 팀원의 이름과 기술 스택을 다시 한번 언급
- 화면 전환이 필요한 시연에서는 "지금은 대시보드 화면이지만, 차트 메뉴를 클릭하면..."과 같이 설명하며 자연스럽게 넘어가기

---


## 🎯 발표 시 강조할 점들

### 💡 핵심 메시지
> **"실제 의료 경험을 바탕으로 의료진이 실제로 사용하는 업무 흐름을 분석하여 시스템을 설계했습니다"**

> **"각자 전문 분야를 담당하여 효율적으로 개발했습니다 - AI-Gateway, Backend, Frontend, Downloads"**

> **"환자 데이터 50명을 수작업으로 구축하는 것은 정말 시간이 많이 걸리는 작업이었습니다"**

> **"문서/검사/처방 관리 시스템까지 포함한 완전한 EMR 시스템을 구축했습니다"**

> **"실제 병원에서 사용할 수 있는 수준의 시스템을 구축했습니다"**

### 🏆 주요 성과 강조
1. **완전한 EMR 시스템 구축** - 실제 병원에서 사용 가능한 수준
2. **AI 기반 검사 분석** - 검사 결과 자동 분석 및 이상 수치 감지
3. **약물 상호작용 검증** - 500개 약물 데이터베이스 기반 상호작용 검사
4. **실시간 대시보드** - 환자 대기 목록 실시간 관리
5. **자동 소견서 생성** - 진료 완료 후 소견서 자동 생성
6. **문서 관리 시스템** - 소견서, 진료 보고서, 처방전 자동 생성
7. **검사 관리 시스템** - 검사 요청부터 결과 해석까지 전 과정 관리
8. **처방 관리 시스템** - 처방전 작성, 상호작용 검사, 처방 이력 관리

### 📊 개발 현황 요약
- **개발 기간**: 2개월
- **팀원**: 4명 (김지현-AI-Gateway, 이윤효-Backend, 이희창-Frontend, 김종원-Downloads)
- **구현된 기능**: 핵심 EMR 시스템 + 문서/검사/처방 관리 시스템 완성
- **환자 데이터**: 50명 환자 + 15명 대기 환자
- **약물 데이터**: 500개 약물 정보
- **데이터 구축**: 환자 50명, 약물 500개 수작업 구축
- **기술 수준**: 실제 병원에서 사용 가능한 수준

### 🎤 발표 시나리오 4개
1. **대시보드** (이희창) - React, CSS Grid, JavaScript Date 객체
2. **환자 차트** (이윤효) - Prisma ORM, RESTful API, SQLite
3. **검사 관리** (김지현) - 조건부 렌더링, 데이터 시뮬레이션
4. **문서 발급** (김종원) - 약물 데이터베이스, Local Storage

---

## ❓ 예상 질의응답

### AI-Gateway 관련 질문 (김지현 담당)

**예상 질문:**
- "AI 분석이 정확한가? 의료진이 신뢰할 수 있는 수준인가?"
- "AI가 잘못된 진단을 내리면 어떻게 책임질 것인가?"
- "실제 의료 데이터로 검증해봤는가?"

**대답 전략:**
- "저희는 AI를 보조 도구로만 사용했습니다. 최종 진단은 의료진이 내리도록 설계했고, AI는 단순히 이상 수치를 시각적으로 표시하는 역할만 합니다."
- "실제 의료 데이터는 사용할 수가 없어, 시뮬레이션 데이터로만 테스트했습니다."

### Backend 관련 질문 (이윤효 담당)

**예상 질문:**
- "데이터 보안은 어떻게 처리했는가?"
- "동시에 여러 의료진이 접속할 때 데이터 충돌은 어떻게 방지했는가?"
- "백업 시스템은 있는가?"

**대답 전략:**
- "현재는 프로토타입 단계로 로컬 SQLite를 사용했습니다. 실제 서비스에서는 암호화와 접근 권한 관리를 구현할 예정입니다."
- "동시 접속 시 데이터 무결성을 위해 트랜잭션 처리를 구현했습니다."
- "백업은 현재 수동으로 하고 있으며, 실제 서비스에서는 자동 백업 시스템을 구축할 예정입니다."

### Frontend 관련 질문 (이희창 담당)

**예상 질문:**
- "사용자 경험이 실제 의료진에게 적합한가?"
- "접근성은 고려했는가?"
- "모바일 환경에서도 사용 가능한가?"

**대답 전략:**
- "실제 의료 경험을 바탕으로 의료진이 실제로 사용하는 업무 흐름을 분석하여 UI/UX를 설계했습니다. 복잡한 의료 정보를 한눈에 볼 수 있도록 레이아웃을 구성했습니다."
- "현재는 데스크톱 환경에 최적화되어 있으며, 모바일 대응은 향후 개발 예정입니다."
- "접근성은 기본적인 키보드 네비게이션을 지원하도록 구현했습니다."

### Downloads 관련 질문 (김종원 담당)

**예상 질문:**
- "약물 데이터의 정확성은 어떻게 보장하는가?"
- "데이터 업데이트는 어떻게 관리하는가?"
- "약물 상호작용 검증의 근거는 무엇인가?"

**대답 전략:**
- "공공 의료 데이터 포털의 공식 데이터를 사용했습니다."
- "현재는 수동으로 업데이트하며, 향후 자동화 시스템을 구축할 예정입니다."
- "약물 상호작용은 기본적인 알고리즘으로 구현했으며 가지고 있는 지식의 약물 위주로 만들었습니다"

### 공통 대답 전략

**실제 의료 경험 활용**
- "실제 의료 경험을 바탕으로 의료진이 실제로 사용하는 업무 흐름을 분석하여 시스템을 설계했습니다."
- "의료진의 실제 업무 환경을 고려하여 사용자 친화적인 인터페이스를 구현했습니다."

**기술적 한계 인정**
- "현재는 프로토타입 단계로, 실제 임상 환경에서는 추가 검증이 필요합니다."
- "실제 의료 데이터는 사용하지 않고 시뮬레이션으로만 테스트했습니다."



**팀워크 강조**
- "각자 전문 분야를 담당하여 효율적으로 개발했습니다."
- "정기적인 코드 리뷰와 회의를 통해 품질을 관리했습니다."
