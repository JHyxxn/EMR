# 🏥 EMR (Electronic Medical Records) System

본 프로젝트는 **외래 진료 환경에 특화된 EMR(Electronic Medical Record) 시스템**을 목표로 개발 중인 프로젝트입니다.  
현재 단계에서는 **외래 진료 흐름을 한눈에 파악할 수 있는 홈 대시보드(UI/UX) 고도화**에 집중하였으며,  
검사실·약국·처방 등 실제 병원 시스템과의 연동은 **구현되어 있지 않습니다**.

---

## 💬 전문가 및 사용자 피드백 기반 설계 배경

본 프로젝트의 홈 대시보드 구조는 실제 사용자(의료진 및 관련 종사자)로부터 받은 피드백을 기반으로 설계되었습니다.

### 주요 피드백
- 메인보드와 사이드바에 기능이 중복되어 있어 시선 분산이 발생함
- 외래 환경에서는 "기능 조작"보다 **현재 환자 상태 흐름을 빠르게 파악**하는 것이 중요함
- 검사 진행과 재진 필요 상태가 화면상에서 중복되어 보임
- 간호사는 검사 수행이 아니라 **검사 완료 여부를 실시간으로 확인**하고 싶어함
- 검사실과 약국은 메인보드가 아닌 **전용 화면 중심 업무 흐름**을 가짐
- 레지던트는 검사 완료 후 다시 봐야 할 환자를 즉시 인지하고 싶어함

### 설계 반영 결과
- 홈 대시보드를 **작업 화면이 아닌 상태 모니터링 화면**으로 재정의
- 사이드바 제거 및 3-Column 구조로 환자 흐름 중심 재구성
- 검사 진행 상태를 하나의 컬럼으로 통합하여 중복 제거
- 홈에서는 view-only 정책을 적용하고, 실제 작업은 전용 화면에서 수행하도록 설계

---

## 🎯 프로젝트 목적

- 외래 진료 환경에서 발생하는  
  **진료 대기 → 검사 → 재진료** 흐름을 직관적으로 파악할 수 있는 시스템 설계
- 의료진(의사·간호사)이 **오늘 외래 상황을 빠르게 인지**할 수 있는 홈 대시보드 제공

---

## 📋 설계 방향

- 외래 전용 EMR 시스템 (입원/IPD 범위 제외)
- 홈 대시보드는 **작업 화면이 아닌 상태 모니터링 화면**
- 역할 분리 고려 (의사 / 간호사 / 검사실)
- 향후 연동을 고려한 확장 가능한 구조 설계


## 🛠 기술 스택

### AI-Gateway (오수민 담당)
**개념**: 인공지능을 활용하여 의료진을 도와주는 기술들
- **JavaScript/TypeScript**: AI 로직 구현 언어
- **조건부 렌더링**: 검사 결과에 따른 시각적 표시
- **데이터 시뮬레이션**: AI 분석 결과 시뮬레이션
- **로컬 데이터 처리**: 약물 상호작용 검증 로직

### Backend (김지현 담당)
**개념**: 웹사이트의 "뒷부분"을 담당하는 기술들
- **Node.js**: JavaScript로 서버를 만드는 기술
- **Express.js**: 웹 애플리케이션을 쉽게 만들 수 있게 해주는 도구
- **SQLite**: 경량 데이터베이스 (개발용)
- **RESTful API**: 프론트엔드와 백엔드를 연결하는 통신 시스템

### Frontend (김지현 담당)
**개념**: 의료진이 실제로 사용하는 화면을 만드는 기술들
- **React 18**: 사용자 인터페이스를 만드는 라이브러리
- **TypeScript**: JavaScript에 타입 안전성을 추가한 언어
- **CSS3 (Grid, Flexbox)**: 레이아웃을 구성하는 스타일링 기술
- **Local Storage**: 브라우저에 데이터를 저장하는 기술

### DataBase (조형석 담당)
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


## 📁 담당자별 주요 파일 목록 

### 김지현 (프론트엔드) 담당 파일

#### 홈 대시보드 핵심 컴포넌트
- **[`frontend/src/components/dashboard/Dashboard.tsx`](frontend/src/components/dashboard/Dashboard.tsx)**
  - 대시보드 메인 컴포넌트
  - CSS Grid 기반 3-Column 레이아웃 관리
  - 환자 상태 통합 관리 (WAITING, IN_TEST)
  - 실시간 시간 표시 및 30분 이전 환자 자동 제외
  - 환자 상태별 필터링 및 컬럼 분배

- **[`frontend/src/components/dashboard/WaitingPatientsColumn.tsx`](frontend/src/components/dashboard/WaitingPatientsColumn.tsx)**
  - 진료 대기 컬럼 컴포넌트
  - 금일 진료 대기 환자 목록 표시
  - 시간순 정렬 및 스크롤 적용
  - 진료 시작 버튼 동작

- **[`frontend/src/components/dashboard/InTestPatientsColumn.tsx`](frontend/src/components/dashboard/InTestPatientsColumn.tsx)**
  - 검사 진행 컬럼 컴포넌트
  - 검사 완료 / 진행 중 2단 구조
  - 진행률 표시 (ProgressGraph)
  - 재진료 버튼 클릭 시 대기 목록으로 이동

- **[`frontend/src/components/dashboard/ScheduleAndAlertsColumn.tsx`](frontend/src/components/dashboard/ScheduleAndAlertsColumn.tsx)**
  - 금일 병원 일정 및 **오늘의 알림 / 업무 요약** 컬럼
  - 교수 외래 진료 시간, 검사실 운영 시간 표시
  - 알림: 약품 대체 필요, **검사 결과 지연**, 소견서 미작성, 재진 대기 중 환자 (건수 표시)
  - 알림 카드 접기/펼치기, 건별 체크 시 "완료한 항목" 영역으로 이동
  - 미완료 건수 실시간 반영

#### 대시보드 공통 컴포넌트
- **[`frontend/src/components/dashboard/PatientCard.tsx`](frontend/src/components/dashboard/PatientCard.tsx)**
  - 환자 카드 공통 컴포넌트
  - 환자 기본 정보 표시 (이름, 나이, 방문 유형)
  - 상태별 레이아웃 지원 (row/column)

- **[`frontend/src/components/common/ProgressGraph.tsx`](frontend/src/components/common/ProgressGraph.tsx)**
  - 검사 진행률 segment 그래프 컴포넌트
  - ■■□□ 형식의 시각적 진행률 표시
  - 완료/전체 비율 표시 옵션

- **[`frontend/src/components/dashboard/ResultsReadyRow.tsx`](frontend/src/components/dashboard/ResultsReadyRow.tsx)**
  - 검사 완료 환자 행 컴포넌트
  - AI 요약 및 상급병원 이송 필요 표시
  - 재진료/상세보기 버튼

- **[`frontend/src/components/dashboard/InProgressRow.tsx`](frontend/src/components/dashboard/InProgressRow.tsx)**
  - 검사 진행 중 환자 행 컴포넌트
  - 현재 진행 중인 검사명 표시
  - 진행률 그래프 표시

#### 기타 핵심 컴포넌트

- **[`frontend/src/components/auth/SearchBar.tsx`](frontend/src/components/auth/SearchBar.tsx)**
  - 환자 검색바 컴포넌트
  - 실시간 검색 기능
  - 검색 결과 드롭다운 표시

- **[`frontend/src/pages/PatientChart.tsx`](frontend/src/pages/PatientChart.tsx)**
  - 재진환자 차트 페이지
  - 환자 검색 및 선택
  - 이전 진료 기록 조회
  - 대기 목록에 재진환자 추가

- **[`frontend/src/pages/ExamManagement.tsx`](frontend/src/pages/ExamManagement.tsx)**
  - **검사 관리 페이지** (검사실 전용 화면)
  - 검사 오더: 처방 데이터에서 자동 생성, 날짜 선택(◀/▶) 후 해당 일자 기준 표시
  - 검사 오더 탭: 타임 스케줄(08:00~18:00, 30분 단위)에 시간대별 오더 배치, 당일 오더 목록·필터(환자/검사 유형)
  - 검사 일정 탭: 연간 캘린더(년도 전환), 날짜별 검사 오더 건수 표시, 날짜 클릭 시 선택

- **[`frontend/src/pages/AppointmentManagement.tsx`](frontend/src/pages/AppointmentManagement.tsx)**
  - 예약 관리 페이지
  - 1년 전체 세로형 캘린더
  - 교수님별 고정 스케줄 표시
  - 예약 생성/수정/취소 기능

- **[`frontend/src/pages/DocumentManagement.tsx`](frontend/src/pages/DocumentManagement.tsx)**
  - 문서(소견서) 관리 페이지
  - 환자별 소견서 목록·검색
  - 소견서 조회·편집·발급

- **[`frontend/src/components/patient-chart/PatientChartModal.tsx`](frontend/src/components/patient-chart/PatientChartModal.tsx)**
  - 진료 차트 모달 컴포넌트
  - SOAP 진료 기록 작성
  - 처방 및 검사 오더 입력
  - AI 임상노트 요약 연동

- **[`frontend/src/components/patient-registration/NewPatientModal.tsx`](frontend/src/components/patient-registration/NewPatientModal.tsx)**
  - 신규 환자 등록 모달
  - 환자 기본 정보 입력
  - 바이탈 사인 입력
  - 대기 목록에 환자 추가

#### 상태 관리 및 유틸리티
- **[`frontend/src/App.tsx`](frontend/src/App.tsx)**
  - 메인 애플리케이션 컴포넌트
  - 페이지 라우팅 관리
  - 전역 상태 관리
  - 인증 관리

- **[`frontend/src/hooks/`](frontend/src/hooks/)** (전체 디렉토리)
  - Context API를 통한 전역 상태 관리
  - 환자 데이터 관리
  - 네비게이션 상태 관리

### 김지현 (백엔드) 담당 파일

#### 서버 및 API
- **[`backend/index.js`](backend/index.js)**
  - Express.js 백엔드 서버 메인 파일
  - 환자 데이터 CRUD API
  - 검사 정보 관리 API
  - 문서 관리 API
  - 처방 관리 API
  - AI Gateway 프록시
  - 관찰치(Observation) 관리 및 임계치 플래그 계산

#### 데이터베이스 및 관리 모듈
- **[`backend/src/documentManagement.js`](backend/src/documentManagement.js)**
  - 문서 관리 시스템
  - 소견서, 진료 보고서, 처방전, 검사 요청서 자동 생성
  - 템플릿 기반 문서 생성

- **[`backend/src/testManagement.js`](backend/src/testManagement.js)**
  - 검사 관리 시스템
  - 검사 요청 생성 및 일정 관리
  - 검사 결과 입력 및 통계

- **[`backend/src/prescriptionManagement.js`](backend/src/prescriptionManagement.js)**
  - 처방 관리 시스템
  - 처방전 생성 및 저장
  - 약물 상호작용 검사
  - 처방 이력 조회

#### 데이터베이스 스키마
- **[`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)**
  - Prisma 데이터베이스 스키마
  - 환자, 진료기록, 관찰치 등 테이블 정의

### 조형석 (데이터베이스) 담당 파일

#### 데이터 생성기
- **[`backend/src/patientDataGenerator50.js`](backend/src/patientDataGenerator50.js)**
  - 환자 데이터 생성기 (50명 + 대기 환자 15명)
  - 환자 기본 정보 생성
  - 진료 이력 생성
  - 알레르기 정보 생성
  - JSON 파일 저장

- **[`backend/src/patientDataGenerator.js`](backend/src/patientDataGenerator.js)**
  - 기본 환자 데이터 생성기

- **[`backend/src/patientDataGeneratorWithDuplicates.js`](backend/src/patientDataGeneratorWithDuplicates.js)**
  - 중복 환자 데이터 생성기

#### 데이터 파일
- **[`backend/patient_data_50_with_waiting.json`](backend/patient_data_50_with_waiting.json)**
  - 생성된 환자 데이터 (50명 + 대기 환자 15명)

- **[`DataBase/drug_dataset_500.json`](DataBase/drug_dataset_500.json)**
  - 약물 데이터베이스 (500개 약물 정보)

### 오수민 (AI Gateway) 담당 파일

#### AI Gateway 서버
- **[`ai-gateway/server.js`](ai-gateway/server.js)**
  - AI Gateway 메인 서버
  - 다중 AI 모델 통합 (OpenAI, Anthropic, Google)
  - 자동 폴백 메커니즘
  - Rate Limit 관리
  - 임상노트 요약, 증상 분석, 처방 가이드 등 AI 기능

#### AI 관련 프론트엔드 컴포넌트
- **[`frontend/src/api/ai.js`](frontend/src/api/ai.js)**
  - AI Gateway API 클라이언트
  - 임상노트 요약, 증상 분석, 처방 가이드 등 API 호출

- **[`frontend/src/components/ai-support/PrescriptionGuideModal.tsx`](frontend/src/components/ai-support/PrescriptionGuideModal.tsx)**
  - AI 처방 가이드 모달
  - 약물 상호작용 검사
  - 용량 가이드 생성

- **[`frontend/src/components/ai-support/SymptomAnalysisModal.tsx`](frontend/src/components/ai-support/SymptomAnalysisModal.tsx)**
  - AI 증상 분석 모달
  - 진단 추천 기능

- **[`frontend/src/components/patient-chart/MedicalOpinionModal.tsx`](frontend/src/components/patient-chart/MedicalOpinionModal.tsx)**
  - 소견서 발급 모달
  - 소견서 자동 생성 및 편집

#### 약물 데이터베이스
- **[`backend/src/drugDatabase.js`](backend/src/drugDatabase.js)**
  - 약물 데이터베이스 관리 모듈
  - 약물 검색 및 상호작용 검사
  - 처방 가이드 생성

---

## 🔨 담당자별 개발 순서 및 파일 구조

### 김지현 (프론트엔드) 개발 순서

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
    ├── SectionTitle.jsx
    ├── ListRow.jsx
    ├── Tabs.jsx
    └── ProgressGraph.tsx     # 검사 진행률 그래프
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
│   ├── Dashboard.tsx         # 메인 대시보드 (3-Column 레이아웃)
│   ├── WaitingPatientsColumn.tsx  # 진료 대기 컬럼
│   ├── InTestPatientsColumn.tsx    # 검사 진행 컬럼
│   ├── ScheduleAndAlertsColumn.tsx # 일정 및 알림 컬럼
│   ├── PatientCard.tsx       # 환자 카드 공통 컴포넌트
│   ├── ResultsReadyRow.tsx   # 검사 완료 환자 행
│   ├── InProgressRow.tsx     # 검사 진행 중 환자 행
│   ├── TestChecklist.tsx     # 검사 체크리스트
│   └── types.ts              # 대시보드 타입 정의
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
├── PatientChart.tsx          # 환자 차트 페이지
├── ExamManagement.tsx        # 검사 관리 페이지
├── DocumentManagement.tsx    # 문서 관리 페이지
└── AppointmentManagement.tsx # 예약 관리 페이지
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

### 김지현 (백엔드) 개발 순서

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
└── index.js                  # Express.js 백엔드 서버
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

### 조형석 (데이터베이스) 개발 순서

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

DataBase/
├── drug_dataset_500.json                  # 약물 데이터베이스 (500개)
├── drug_database_collector.py             # 약물 데이터 수집 스크립트
├── generate_drug_data.js                  # 약물 데이터 생성 스크립트
└── sample_drug_database.py                # 샘플 약물 데이터베이스 생성기
```

**개발 순서 요약:**
1. 기본 데이터 생성기 → 2. 확장 데이터 생성기 (50명 + 대기 환자) → 3. 데이터 파일 생성 및 검증

---

### 오수민 (AI Gateway) 개발 순서

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