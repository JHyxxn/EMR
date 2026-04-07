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
- 메인보드와 **기능이 겹치던 사이드 패널은 정리**하고, 홈은 3-Column(대기·검사·일정/알림) 중심으로 재구성 (**페이지 전환용 좌측 `Sidebar`는 `App.tsx`에서 유지**)
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

### DataBase (송유찬 담당)
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

> 경로는 저장소 루트 기준입니다. **링크가 붙은 파일명**은 GitHub·IDE에서 클릭 시 해당 소스로 이동합니다. (아래 `개발 순서` 코드 블록 안의 트리는 개념 정리용이라 링크 없음 — 필요 시 이 목록에서 엽니다.)

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

- **[`frontend/src/components/auth/LoginModal.tsx`](frontend/src/components/auth/LoginModal.tsx)**
  - 로그인 모달 (`authStore`, JWT)

- **[`frontend/src/components/layout/Header.tsx`](frontend/src/components/layout/Header.tsx)** / **[`Sidebar.tsx`](frontend/src/components/layout/Sidebar.tsx)**
  - 상단 헤더(검색·신규환자 등) · 좌측 페이지 네비게이션

- **[`frontend/src/pages/PatientChart.tsx`](frontend/src/pages/PatientChart.tsx)**
  - 재진환자 차트 페이지
  - 환자 검색 및 선택
  - 이전 진료 기록 조회
  - 대기 목록에 재진환자 추가

- **[`frontend/src/pages/ExamManagement.tsx`](frontend/src/pages/ExamManagement.tsx)**
  - **검사 관리 페이지** (검사실 전용 화면)
  - **검사 오더** 탭: 검사 플로우 추적 + 운영 요약 + 환자 상세(3영역)
    - 상단 **오늘 현황**(`OpsSummaryPanel`): 대기/진행/완료/지연 건수, 병목 Top3, 지연·노쇼 목록
    - 날짜 선택 `◀ YYYY.MM.DD ▶`
    - **ExamFlowBoard**: 시간(08:00~17:30, 30분) × 검사유형(혈액·소변·X-ray·심전도·CT) 매트릭스, 셀에 환자 미니 카드
    - 환자별 검사 순서는 셀 간 **점선 연결선 + 화살표**(SVG 오버레이, 셀 `data-*` 좌표 기준)로 표시
    - **PatientDetailPanel**: 선택 환자의 검사 진행 칩, 결과 요약·AI 요약·플래그·추천 액션
    - 데이터: 대시보드 **검사 진행**과 동일한 `prescriptions`(해당 날짜) 연동, 없을 때 더미 데이터
  - **검사 일정** 탭: 선택 날짜·검사 건수 요약, 연간 캘린더(년도 전환·3×4 월 그리드), 날짜 클릭 시 선택, 해당일 오더는 칩으로 **환자명 · 검사유형 한글 라벨**(`EXAM_TYPE_LABELS`) 표시

#### 검사 플로우 UI (`exam-flow/`)
- **[`frontend/src/components/exam-flow/types.ts`](frontend/src/components/exam-flow/types.ts)** — `ExamType`, `ExamStatus`, `ExamOrderItem`, `OpsSummary` 등 타입
- **[`frontend/src/components/exam-flow/examFlowUtils.ts`](frontend/src/components/exam-flow/examFlowUtils.ts)** — 시간 슬롯, 매트릭스 구성, 운영 요약, 환자별 타임라인 세그먼트
- **[`frontend/src/components/exam-flow/prescriptionToExamOrders.ts`](frontend/src/components/exam-flow/prescriptionToExamOrders.ts)** — 처방 `tests` → `ExamOrderItem[]` 변환(대시보드와 연동)
- **[`frontend/src/components/exam-flow/dummyData.ts`](frontend/src/components/exam-flow/dummyData.ts)** — 날짜별 더미 검사 오더
- **[`frontend/src/components/exam-flow/ExamFlowBoard.tsx`](frontend/src/components/exam-flow/ExamFlowBoard.tsx)** — 메인 그리드 보드, 연결선 SVG 오버레이
- **[`frontend/src/components/exam-flow/ExamCell.tsx`](frontend/src/components/exam-flow/ExamCell.tsx)** / **[`PatientCardMini.tsx`](frontend/src/components/exam-flow/PatientCardMini.tsx)** — 셀·미니 카드
- **[`frontend/src/components/exam-flow/PatientDetailPanel.tsx`](frontend/src/components/exam-flow/PatientDetailPanel.tsx)** / **[`OpsSummaryPanel.tsx`](frontend/src/components/exam-flow/OpsSummaryPanel.tsx)** — 우측 상세·상단 운영 요약
- **[`frontend/src/components/exam-flow/index.ts`](frontend/src/components/exam-flow/index.ts)** — 타입·유틸·컴포넌트·`EXAM_TYPE_LABELS` 등 모듈 export

- **[`frontend/src/pages/AppointmentManagement.tsx`](frontend/src/pages/AppointmentManagement.tsx)**
  - 예약 관리 페이지
  - 1년 전체 세로형 캘린더
  - 교수님별 고정 스케줄 표시
  - 예약 생성/수정/취소 기능

- **[`frontend/src/pages/DocumentManagement.tsx`](frontend/src/pages/DocumentManagement.tsx)**
  - 문서(소견서) 관리 페이지
  - 환자별 소견서 목록·검색, 방문 이력·소견 편집
  - 소견 목록은 브라우저 **localStorage**(`medicalOpinions`)와 연동

- **[`frontend/src/components/patient-chart/PatientChartModal.tsx`](frontend/src/components/patient-chart/PatientChartModal.tsx)**
  - 진료 차트 모달 컴포넌트
  - SOAP 진료 기록 작성
  - 처방 및 검사 오더 입력
  - AI 임상노트 요약 연동

- **[`frontend/src/components/patient-chart/VisitHistoryModal.tsx`](frontend/src/components/patient-chart/VisitHistoryModal.tsx)**
  - 방문 이력 조회 모달(과거 방문 요약 표시)

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

- **[`frontend/src/main.tsx`](frontend/src/main.tsx)**
  - Vite/React 진입점, Provider·ErrorBoundary 래핑

- **[`frontend/src/hooks/`](frontend/src/hooks/)** (디렉터리)
  - **[`authStore.jsx`](frontend/src/hooks/authStore.jsx)** — 인증·JWT
  - **[`navigationStore.jsx`](frontend/src/hooks/navigationStore.jsx)** — `currentPage` 전환
  - **[`patientStore.jsx`](frontend/src/hooks/patientStore.jsx)** / **[`patientStoreContext.jsx`](frontend/src/hooks/patientStoreContext.jsx)** — 선택 환자·Context 정의

- **기반·유틸·API (요약 링크)**  
  - **[`frontend/src/design/tokens.js`](frontend/src/design/tokens.js)** — 색·간격 등 디자인 토큰  
  - **[`frontend/src/types/index.ts`](frontend/src/types/index.ts)** — 공용 TS 타입  
  - **[`frontend/src/utils/validation.ts`](frontend/src/utils/validation.ts)** / **[`mrnGenerator.ts`](frontend/src/utils/mrnGenerator.ts)** — 폼 검증·MRN  
  - **[`frontend/src/api/client.js`](frontend/src/api/client.js)** / **[`index.js`](frontend/src/api/index.js)** — HTTP 클라이언트·API 배럴  
  - 기타 모듈: `api/patients.js`, `auth.js`, `prescriptions.js`, `tests.js`, `documents.js`, `drugs.js`, `observations.js` 등 (`frontend/src/api/`)

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

### 송유찬 (데이터베이스) 담당 파일

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
    ├── index.ts              # validation·mrnGenerator 배럴
    ├── validation.ts         # 폼 유효성 검사
    └── mrnGenerator.ts       # MRN 생성기
```

#### 2단계: 데이터 및 상태 관리
```
frontend/src/
├── data/                      # 정적 데이터
│   ├── waitingPatientsData.ts    # 대기 환자 데이터
│   ├── patientHistoryData.ts     # 환자 이력 데이터
│   ├── revisitPatientsData.ts    # 재진 환자 데이터
│   ├── patients.ts               # 환자 기본 데이터(API·검색용)
│   ├── patientData.ts            # 차트 시연용 확장 레코드
│   └── usageExamples.ts          # 이력 CRUD 사용 예시
└── hooks/                     # Context API 상태 관리
    ├── authStore.jsx          # 인증 상태
    ├── patientStoreContext.jsx # 환자 Context 정의·usePatientStore
    ├── patientStore.jsx       # 환자 상태 Provider
    └── navigationStore.jsx    # 네비게이션 상태
```

#### 3단계: 공통 컴포넌트
```
frontend/src/components/
└── common/                    # 재사용 가능한 공통 컴포넌트
    ├── Button.jsx            # 버튼
    ├── Input.jsx             # 텍스트 입력
    ├── TextArea.jsx          # 여러 줄 입력
    ├── Card.jsx              # 카드 컨테이너
    ├── SectionTitle.jsx      # 소제목
    ├── ListRow.jsx           # 목록 행
    ├── Tabs.jsx              # 탭
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
│   ├── LoginModal.tsx        # 로그인 모달 (JWT)
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
│   ├── VitalInput.tsx        # 바이탈 입력
│   ├── VisitInfo.tsx         # 방문 정보·AI 요약
│   ├── PatientNotes.tsx      # 노트
│   ├── PatientSummary.tsx    # 요약 그리드
│   └── index.ts              # 등록 관련 export
├── exam-flow/                # 검사 관리 플로우 UI
│   ├── types.ts              # ExamType, ExamOrderItem, OpsSummary 등 타입
│   ├── examFlowUtils.ts      # 시간 슬롯, 매트릭스, 운영 요약, 환자별 연결 세그먼트
│   ├── prescriptionToExamOrders.ts  # 대시보드 처방 tests → ExamOrderItem 변환
│   ├── dummyData.ts          # 날짜별 더미 검사 오더
│   ├── ExamFlowBoard.tsx     # 시간×검사유형 그리드, SVG 타임라인 연결선
│   ├── ExamCell.tsx          # 매트릭스 한 칸(슬롯×검사유형)
│   ├── PatientCardMini.tsx   # 셀 안 미니 환자 카드
│   ├── PatientDetailPanel.tsx  # 선택 환자 상세(칩·요약·플래그)
│   ├── OpsSummaryPanel.tsx   # 상단 운영 요약(건수·병목·지연)
│   └── index.ts              # 타입·유틸·컴포넌트 export
└── patient-chart/            # 환자 차트
    ├── PatientChartModal.tsx  # 진료 차트 모달
    ├── MedicalOpinionModal.tsx # 소견서 모달
    ├── VisitHistoryModal.tsx  # 방문 이력 모달
    ├── ClinicalNoteCard.jsx   # AI 임상 요약 카드
    └── index.ts               # 차트 관련 export
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
├── client.js                  # fetch 래퍼·베이스 URL
├── index.js                   # Auth/Patients/Obs/AI/… 네임스페이스 배럴
├── patients.js                # 환자 CRUD·검색
├── auth.js                    # 로그인·토큰
├── ai.js                      # AI Gateway 프록시 호출
├── prescriptions.js           # 처방
├── tests.js                   # 검사
├── documents.js               # 문서·소견 생성 API
├── drugs.js                   # 약물 검색·상호작용
└── observations.js            # 관찰치(Observation)
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
    ├── 20250819055332_init_emr/
    └── 20250819055950_npx_prisma_studio/  # 기타 마이그레이션(환경에 따라 추가 폴더 있음)
```

#### 2단계: 관리 모듈 개발
```
backend/src/
├── documentManagement.js     # 문서(소견·보고서·처방전·검사요청서) 생성·저장
├── testManagement.js         # 검사 요청·일정·결과·통계
└── prescriptionManagement.js # 처방전·상호작용·이력
```

#### 3단계: 약물 데이터베이스 연동
```
backend/src/
└── drugDatabase.js           # 약물 검색·상호작용·처방 가이드(JSON 로드)
```

#### 4단계: 메인 서버 구축
```
backend/index.js              # Express 엔트리: CORS, 환자/Observation/문서/검사/처방 API, /api/ai 프록시
```

**개발 순서 요약:**
1. 데이터베이스 스키마 설계 → 2. 관리 모듈 개발 → 3. 약물 데이터베이스 연동 → 4. 메인 서버 구축 및 API 통합

---

### 송유찬 (데이터베이스) 개발 순서

#### 1단계: 기본 데이터 생성기
```
backend/src/
└── patientDataGenerator.js   # 기본 환자 100명 등 랜덤 생성·JSON 저장
```

#### 2단계: 확장 데이터 생성기
```
backend/src/
├── patientDataGeneratorWithDuplicates.js  # 동명이인·중복 케이스 포함 생성
└── patientDataGenerator50.js              # 50명 + 대기 15명·이력·알레르기·통계
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
├── server.js                 # Express AI Gateway 본체 (CORS, Rate Limit, 라우팅·/insight)
└── package.json              # Node 의존성 (express, OpenAI/Anthropic/Google SDK 등)
```

#### 2단계: 다중 AI 모델 통합
```
ai-gateway/server.js (파일 내부 역할)
├── 모델·ENV 설정             # OpenAI / Anthropic / Google 키·엔드포인트
├── callOpenAI()              # OpenAI Chat API 호출
├── callAnthropic()           # Claude API 호출
├── callGoogle()              # Gemini API 호출
└── callLLM()                 # 통합 진입점, 실패 시 벤더 자동 폴백
```

#### 3단계: AI 인사이트 기능 개발
```
ai-gateway/server.js (HTTP 라우트 예시)
├── POST /insight/clinical-note     # 임상노트(SOAP) 요약
├── POST /insight/lab-summary       # Lab·바이탈 요약
├── POST /insight/symptom-analysis # 증상 기반 분석·진단 힌트
├── POST /insight/prescription-guide # 처방·상호작용 가이드
└── POST /insight/test-analysis    # 검사 수치 해석·요약
```

#### 4단계: 프론트엔드 API 클라이언트
```
frontend/src/api/
└── ai.js                     # 백엔드 프록시(/api/ai/*) → AI Gateway 연동
    ├── health()              # Gateway 헬스체크
    ├── getModelStatus()      # 모델 가용 상태
    ├── clinicalNote()        # 임상노트 요약
    ├── labSummary()          # Lab/바이탈 요약
    ├── symptomAnalysis()     # 증상 분석
    ├── prescriptionGuide()   # 처방 가이드
    └── testAnalysis()        # 검사 결과 분석
```

#### 5단계: AI 지원 컴포넌트
```
frontend/src/components/ai-support/
├── PrescriptionGuideModal.tsx  # 처방 입력·상호작용·용량 가이드 UI
├── SymptomAnalysisModal.tsx    # 증상 입력·심각도·AI 분석 결과 UI
└── index.ts                    # 위 모달·모듈 export 배럴
```

#### 6단계: 약물 데이터베이스 연동
```
backend/src/
└── drugDatabase.js           # 약물 검색·상호작용·처방 가이드 (DataBase/drug_dataset_500.json 등)
```

**개발 순서 요약:**
1. AI Gateway 서버 기본 구조 → 2. 다중 AI 모델 통합 → 3. AI 인사이트 기능 개발 → 4. 프론트엔드 API 클라이언트 → 5. AI 지원 컴포넌트 → 6. 약물 데이터베이스 연동