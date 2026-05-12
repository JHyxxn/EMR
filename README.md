# 🏥 EMR (Electronic Medical Records) System

<a id="readme-top"></a>

본 프로젝트는 **외래 진료 환경에 특화된 EMR(Electronic Medical Record) 시스템**을 목표로 개발 중인 프로젝트입니다.  
현재 단계에서는 **외래 진료 흐름을 한눈에 파악할 수 있는 홈 대시보드(UI/UX) 고도화**에 집중하였으며,  
검사실·약국·처방 등 실제 병원 시스템과의 연동은 **구현되어 있지 않습니다**.

---

## 바로 가기

| 구간 | 설명 |
|:---|:---|
| [↑ 맨 위](#readme-top) | 문서 상단으로 |
| [개요·배경·목적](#readme-overview) | 피드백, 목적, 설계 방향, **저장소 폴더 요약** |
| [팀·기술 스택](#readme-team) | 담당 표 + 역할 |
| [기술 스택 상세](#readme-tech) | 담당자별 스택·도구 |
| [주요 파일 (링크)](#readme-files) | GitHub/IDE에서 **클릭으로 소스 이동** |
| [개발 순서·폴더 트리](#readme-dev) | 단계별 디렉터리 구조 |
| [예상 Q&A](#readme-qna) | 프론트·백·DB·AI·연동 질의 예시 |
| [결과보고서 작성 참고 문서](#readme-report-docs) | `md/` 문서 **읽는 순서**와 링크 |

---

<a id="readme-overview"></a>

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

### 저장소 구조 (요약)

| 경로 | 역할 |
|:---|:---|
| **`frontend/`** | React 18 + Vite + TypeScript UI (`src/` 아래 페이지·컴포넌트·API 클라이언트) |
| **`backend/`** | Express API, Prisma, 업무 모듈(`src/`) |
| **`ai-gateway/`** | 다중 LLM 연동 서버 (`server.js`) |
| **`DataBase/`** | 약물 JSON·수집/생성 스크립트(Python·Node) |

---

<a id="readme-team"></a>

## 👥 팀 및 담당 분야

<table>
  <colgroup>
    <col width="96">
    <col width="180">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th align="left">이름</th>
      <th align="left">담당 분야</th>
      <th align="left">책임 한 줄</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="left" nowrap><strong>김지현</strong></td>
      <td align="left" nowrap>팀장, <strong>AI</strong>, <strong>Backend</strong></td>
      <td align="left"><strong>프로젝트 축</strong> — Express·업무 모듈·<strong><code>ai-gateway</code></strong>, API·도메인·프론트와의 계약까지 <strong>주도</strong></td>
    </tr>
    <tr>
      <td align="left" nowrap><strong>오수민</strong></td>
      <td align="left" nowrap><strong>AI</strong>, <strong>Frontend</strong></td>
      <td align="left"><strong>프론트엔드 구현 지원</strong> — 김지현이 맞춘 API·계약 위에서 <strong>화면·상태·<code>api</code> 호출·AI 결과 표시</strong></td>
    </tr>
    <tr>
      <td align="left" nowrap><strong>송유찬</strong></td>
      <td align="left" nowrap><strong>Backend</strong>, <strong>DataBase</strong></td>
      <td align="left"><strong>데이터 레이어</strong> — <strong>Prisma</strong>, 생성기·JSON, <strong><code>drugDatabase</code></strong>, <code>DataBase/</code> (김지현 백엔드와 맞춤)</td>
    </tr>
  </tbody>
</table>

> **역할 나눔**  
> - **김지현**: **서버·비즈니스 로직·AI Gateway**를 총괄한다. **추론·모델·폴백·Rate Limit·`/insight/*`** 등 AI **본체**는 `ai-gateway`와 백엔드에 두고, 프론트는 그 **소비·표현**에 가깝다.  
> - **오수민**: **React 화면·상태·내비게이션**과 **`frontend/src/api/*`·UI**를 **지원·분담**한다. AI는 **게이트웨이 응답을 붙이는 UX**(모달, 차트, 로딩·에러) 중심이다.  
> - **송유찬**: **스키마·마이그레이션·시드·약물 JSON** 등 **DB·데이터 자산**을 주도한다. 김지현의 Prisma 사용·API와 맞춘다.  
>
> **정리**: `frontend/` **파일 수가 많아 보여도**, **의사결정·연산·계약의 중심**은 **`backend/`·`ai-gateway/`** 이며, **팀 업무 양**도 **김지현이 가장 크다**.

---

<a id="readme-tech"></a>

## 🛠 기술 스택 (담당과 연계)

### 김지현 (팀장, AI, Backend)
- **Backend**: Node.js, Express.js, RESTful API, 백엔드 ↔ AI Gateway 연동·프록시
- **AI**: `ai-gateway` — 다중 LLM(OpenAI, Anthropic, Google), `/insight/*` 라우트, Rate Limit, **실제 LLM 호출·프롬프트·응답 가공의 중심**
- **DB 연동**: Prisma 클라이언트 사용(스키마·마이그레이션은 송유찬 주도)
- **프론트와의 관계**: API·검사·처방 **계약과 방향을 먼저 정하고**, 프론트 구현은 **오수민이 지원**하되 필요 시 **직접 보완**하는 역할

### 오수민 (AI, Frontend)
- **Frontend**: React 18, TypeScript, Vite, CSS(Grid/Flexbox), Local Storage — **김지현이 맞춘 백엔드·게이트웨이에 맞춘 화면 구현**
- **AI(프론트)**: `api/ai.js`로 게이트웨이를 **경유 호출**하고, 모달·차트·임상노트에 **결과를 반영**한다(추론은 게이트웨이·김지현 측)

### 송유찬 (Backend, DataBase)
- **DataBase**: Prisma(`schema.prisma`, migrations), SQLite, 환자·약물 JSON, Python/Node 데이터 스크립트
- **Backend**: `drugDatabase.js`, 환자 데이터 생성기(`patientDataGenerator*` 등), `DataBase/` 자산

### 개발 도구

| 도구 | 용도 |
|:---|:---|
| **Git** / **GitHub** | 버전 관리·협업 |
| **Vite** | 프론트 개발 서버·프로덕션 빌드 |

---

<a id="readme-files"></a>

## 📁 담당자별 주요 파일 목록

### 김지현 (팀장, AI, Backend) 담당 파일

#### Express 서버·API
- **[`backend/index.js`](backend/index.js)**
  - Express 백엔드 엔트리: 환자 CRUD, 검사·문서·처방 API, 관찰치(Observation), **`/api/ai` → AI Gateway 프록시**

#### 업무 모듈 (`backend/src/`)
- **[`backend/src/documentManagement.js`](backend/src/documentManagement.js)** — 소견·보고서·처방전·검사요청서 생성
- **[`backend/src/testManagement.js`](backend/src/testManagement.js)** — 검사 요청·일정·결과·통계
- **[`backend/src/prescriptionManagement.js`](backend/src/prescriptionManagement.js)** — 처방전·상호작용·이력

#### AI Gateway 서버
- **[`ai-gateway/server.js`](ai-gateway/server.js)**
  - 다중 LLM(OpenAI, Anthropic, Google), 자동 폴백, Rate Limit, `/insight/*` 임상·증상·처방·검사 분석 API

---

### 오수민 (AI, Frontend) 담당 파일 — **프론트 구현 지원**

| 구분 | 경로 요약 |
|:---|:---|
| 대시보드 | `frontend/src/components/dashboard/` |
| 검사 플로우 | `frontend/src/components/exam-flow/` |
| 차트·등록 | `patient-chart/`, `patient-registration/` |
| AI 연동 UI | `ai-support/`, `api/ai.js` |
| 앱 셸·상태 | `App.tsx`, `main.tsx`, `hooks/` |

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

#### AI 연동 (프론트)
- **[`frontend/src/api/ai.js`](frontend/src/api/ai.js)** — 백엔드 프록시 경유 AI Gateway 호출 (`clinicalNote`, `labSummary`, `symptomAnalysis`, `prescriptionGuide`, `testAnalysis` 등)
- **[`frontend/src/components/ai-support/PrescriptionGuideModal.tsx`](frontend/src/components/ai-support/PrescriptionGuideModal.tsx)** / **[`SymptomAnalysisModal.tsx`](frontend/src/components/ai-support/SymptomAnalysisModal.tsx)** — 처방 가이드·증상 분석 UI
- **[`frontend/src/components/patient-chart/MedicalOpinionModal.tsx`](frontend/src/components/patient-chart/MedicalOpinionModal.tsx)** — 소견서 발급·편집(차트·AI 연동)

---

### 송유찬 (Backend, DataBase) 담당 파일

#### Prisma 스키마·마이그레이션
- **[`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)** — User, Patient, Encounter, Observation 등 테이블 정의
- **`backend/prisma/migrations/`** — DB 마이그레이션 이력

#### Backend (데이터·약물 연동)
- **[`backend/src/drugDatabase.js`](backend/src/drugDatabase.js)** — 약물 JSON 로드, 검색·상호작용·처방 가이드 API 로직

#### 데이터 생성기·자산
- **[`backend/src/patientDataGenerator.js`](backend/src/patientDataGenerator.js)** / **[`patientDataGeneratorWithDuplicates.js`](backend/src/patientDataGeneratorWithDuplicates.js)** / **[`patientDataGenerator50.js`](backend/src/patientDataGenerator50.js)**
- **[`backend/patient_data_50_with_waiting.json`](backend/patient_data_50_with_waiting.json)** — 생성된 환자·대기 샘플 데이터
- **[`DataBase/drug_dataset_500.json`](DataBase/drug_dataset_500.json)** 및 **`DataBase/`** 스크립트(`drug_database_collector.py`, `generate_drug_data.js`, `sample_drug_database.py` 등)

---

<a id="readme-dev"></a>

## 🔨 담당자별 개발 순서 및 파일 구조

> 트리는 **참고용**입니다. 실제 파일 열기는 [주요 파일 목록](#readme-files)의 링크가 편합니다.

| 담당 | 이 섹션에서 보는 내용 |
|:---|:---|
| **김지현** | `backend/src` 모듈 → `index.js` → `ai-gateway` → **처방·검사 도메인과 `exam-flow`/대시보드 계약** |
| **오수민** | `frontend/src` 기반·데이터·컴포넌트·페이지·API·`App` |
| **송유찬** | Prisma → `drugDatabase` → 생성기 → JSON/`DataBase/` |

### 김지현 (팀장, AI, Backend) 개발 순서

#### 1단계: 업무 모듈 (`backend/src/`)
```
backend/src/
├── documentManagement.js     # 문서(소견·보고서·처방전·검사요청서) 생성·저장
├── testManagement.js         # 검사 요청·일정·결과·통계
└── prescriptionManagement.js # 처방전·상호작용·이력
```

#### 2단계: 메인 서버 (`backend/index.js`)
```
backend/index.js              # Express: CORS, 환자/Observation/문서/검사/처방 API, /api/ai → AI Gateway 프록시
```

#### 3단계: AI Gateway 패키지 기본 구조
```
ai-gateway/
├── server.js                 # Express AI Gateway (CORS, Rate Limit, /insight 라우트)
└── package.json              # OpenAI / Anthropic / Google SDK 등
```

#### 4단계: 다중 AI 모델·라우트 (`ai-gateway/server.js` 내부)
```
├── 모델·ENV 설정             # 벤더별 키·엔드포인트
├── callOpenAI / callAnthropic / callGoogle
├── callLLM()                 # 자동 폴백
└── POST /insight/clinical-note, lab-summary, symptom-analysis, prescription-guide, test-analysis
```

<a id="readme-dev-kim-prescription-exam"></a>

#### 5단계: 처방·검사 도메인과 프론트(`exam-flow`·대시보드) 계약 (김지현)

대시보드 **검사 진행**·**검사 관리** UI가 쓰는 `prescriptions`(및 `tests` 등) 표현과, `exam-flow`의 **`ExamOrderItem`** 매핑이 어긋나지 않도록 **백엔드에서 필드·의미를 먼저 고정**한다.

```
backend/src/
├── prescriptionManagement.js   # 처방에 실린 검사 목록·오더 표현
├── testManagement.js           # 검사 요청·결과·통계와의 연계
└── (연계) index.js             # /api/prescriptions, /api/tests 등 — 동일 JSON 계약으로 응답
```

프론트 쪽 변환 파일은 `frontend/` 아래에 두되, **스키마·계약의 기준은 김지현(백엔드)** 이다.

```
frontend/src/components/exam-flow/prescriptionToExamOrders.ts
# 대시보드 처방 tests → ExamOrderItem[] (위 백엔드 계약에 맞춘 클라이언트 변환)
```

**개발 순서 요약 (김지현):** 업무 모듈 → 메인 API 서버 → AI Gateway 서버·모델 통합 → 처방·검사 API 계약으로 `exam-flow`/대시보드와 맞춤

---

### 오수민 (AI, Frontend) 개발 순서 — **지원·분담**

#### 1단계: 기반 구조 설정 (오수민)
```
frontend/src/
├── design/tokens.js          # 디자인 토큰 (색상, 간격 등)
├── types/index.ts            # TypeScript 타입 정의
└── utils/                     # 유틸리티 함수
    ├── index.ts              # validation·mrnGenerator 배럴
    ├── validation.ts         # 폼 유효성 검사
    └── mrnGenerator.ts       # MRN 생성기
```

#### 2단계: 데이터 및 상태 관리 (오수민)
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

#### 3단계: 공통 컴포넌트 (오수민)
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

#### 4단계: 레이아웃 컴포넌트 (오수민)
```
frontend/src/components/
└── layout/                    # 레이아웃 컴포넌트
    ├── Header.tsx            # 상단 헤더 (검색바 포함)
    └── Sidebar.tsx           # 좌측 사이드바
```

#### 5단계: 기능별 컴포넌트 (오수민)

화면·상호작용 위주. 
**`ai-support/`**, 차트·등록의 **AI 요약·가이드**는 **텍스트 생성·추론은 AI Gateway(김지현)**, 
**모달·카드·호출 타이밍·로딩 처리는 오수민**. 
검사 오더 **데이터 의미·API 형태**는 [김지현 5단계(처방·검사 계약)](#readme-dev-kim-prescription-exam)와 맞춘다.

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
│   ├── VisitInfo.tsx         # 방문 정보·AI 요약(UI; 요약 본문은 게이트웨이)
│   ├── PatientNotes.tsx      # 노트
│   ├── PatientSummary.tsx    # 요약 그리드
│   └── index.ts              # 등록 관련 export
├── exam-flow/                # 검사 관리 플로우 UI(오더 필드 정의·API 계약은 김지현 5단계)
│   ├── types.ts              # ExamType, ExamOrderItem, OpsSummary 등 타입
│   ├── examFlowUtils.ts      # 시간 슬롯, 매트릭스, 운영 요약, 환자별 연결 세그먼트
│   ├── prescriptionToExamOrders.ts  # 처방 tests → ExamOrderItem(백엔드 계약 반영 변환)
│   ├── dummyData.ts          # 날짜별 더미 검사 오더
│   ├── ExamFlowBoard.tsx     # 시간×검사유형 그리드, SVG 타임라인 연결선
│   ├── ExamCell.tsx          # 매트릭스 한 칸(슬롯×검사유형)
│   ├── PatientCardMini.tsx   # 셀 안 미니 환자 카드
│   ├── PatientDetailPanel.tsx  # 선택 환자 상세(칩·요약·플래그)
│   ├── OpsSummaryPanel.tsx   # 상단 운영 요약(건수·병목·지연)
│   └── index.ts              # 타입·유틸·컴포넌트 export
├── ai-support/               # AI 모달 UI(응답은 /insight/* 게이트웨이)
│   ├── PrescriptionGuideModal.tsx
│   ├── SymptomAnalysisModal.tsx
│   └── index.ts
└── patient-chart/            # 환자 차트
    ├── PatientChartModal.tsx  # 진료 차트 모달
    ├── MedicalOpinionModal.tsx # 소견서 모달
    ├── VisitHistoryModal.tsx  # 방문 이력 모달
    ├── ClinicalNoteCard.jsx   # 임상 요약 카드 UI(요약 생성은 게이트웨이)
    └── index.ts               # 차트 관련 export
```

#### 6단계: 페이지 컴포넌트 (오수민)
```
frontend/src/pages/
├── PatientChart.tsx          # 환자 차트 페이지
├── ExamManagement.tsx        # 검사 관리 페이지
├── DocumentManagement.tsx    # 문서 관리 페이지
└── AppointmentManagement.tsx # 예약 관리 페이지
```

#### 7단계: API 연동

트리 안 각 줄의 `# … (김지현, 오수민, …)` 에서 괄호 안은 **연동에 관여한 담당자 전체 이름**(쉼표 구분)입니다. 
역할 참고: **김지현** — Express·업무 모듈·AI Gateway /
 **오수민** — 프론트 `api` 모듈·호출 / 
 **송유찬** — Prisma·시드·`drugDatabase`·JSON

```
frontend/src/api/
├── client.js                  # fetch 래퍼·베이스 URL (오수민)
├── index.js                   # Auth/Patients/Obs/AI/… 배럴 (오수민)
├── patients.js                # 환자 CRUD·검색 (김지현, 오수민, 송유찬)
├── auth.js                    # 로그인·토큰 (김지현, 오수민)
├── ai.js                      # AI Gateway 경유 호출 (김지현, 오수민)
├── prescriptions.js           # 처방 (김지현, 오수민, 송유찬)
├── tests.js                   # 검사 (김지현, 오수민)
├── documents.js               # 문서·소견 생성 (김지현, 오수민)
├── drugs.js                   # 약물 검색·상호작용 (김지현, 오수민, 송유찬)
└── observations.js            # 관찰치(Observation) (김지현, 오수민, 송유찬)
```

#### 8단계: 메인 앱 통합 (오수민)
```
frontend/src/
├── App.tsx                    # 메인 애플리케이션 컴포넌트
└── main.tsx                   # 앱 진입점
```

**개발 순서 요약** — 1. 토큰·타입 → 2. 데이터·hooks → 3. 공통 UI → 4. 레이아웃 → 5. 기능 컴포넌트(대시보드·차트·`ai-support`·임상요약 카드 등) → 6. 페이지 → **7. API** (트리 `#` 줄 끝 `(이름, …)` 연동 담당) → 8. `App`·`main` 통합

#### (참고) AI 프론트 연동 트리
```
frontend/src/api/ai.js        # health, getModelStatus, clinicalNote, labSummary, symptomAnalysis, prescriptionGuide, testAnalysis
frontend/src/components/ai-support/  # PrescriptionGuideModal, SymptomAnalysisModal, index.ts
```

---

### 송유찬 (Backend, DataBase) 개발 순서

#### 1단계: Prisma 스키마·마이그레이션 
```
backend/prisma/
├── schema.prisma             # User, Patient, Encounter, Observation 등
└── migrations/               # 예: 20250818073029_add_user, 20250819055332_init_emr, 20250819055950_npx_prisma_studio …
```

#### 2단계: 약물 데이터 연동 모듈
```
backend/src/
└── drugDatabase.js           # DataBase/drug_dataset_500.json 등 로드·검색·상호작용
```

#### 3단계: 환자 데이터 생성기
```
backend/src/
├── patientDataGenerator.js
├── patientDataGeneratorWithDuplicates.js
└── patientDataGenerator50.js
```

#### 4단계: 데이터 파일·`DataBase/` 자산
```
backend/patient_data_50_with_waiting.json
DataBase/drug_dataset_500.json, *.py, generate_drug_data.js 등
```

**개발 순서 요약** — Prisma 스키마·마이그레이션 → `drugDatabase` → 생성기 → JSON·스크립트 검증

---

<a id="readme-qna"></a>

## 예상 Q&A (발표·심사 대비)

아래는 저장소 구조와 **`README.md` 본문**을 읽은 뒤 자주 나올 수 있는 질문에 대한 **요지 답변**입니다. 세부 수치·한계는 [결과보고서 작성 참고 문서](#readme-report-docs)의 **`md/결과보고서.md`**를 함께 본다.

### Frontend

| 질문(예시) | 답변 요지 |
|:---|:---|
| 프론트는 무엇으로 만들었나? | **React 18**, **TypeScript**, **Vite**. UI는 컴포넌트·페이지 단위로 모듈화. |
| 홈 대시보드의 역할은? | 외래 **상태 모니터링·조회 중심(view-only)**. **3-Column**(대기·검사·일정/알림). 실제 작업은 차트·검사·문서 등 **전용 화면**에서 수행. |
| API는 어디서 호출하나? | **`frontend/src/api/*`** (`client.js`, `patients.js`, `ai.js` 등). 담당은 본 README의 API 트리·팀 표기 참고. |
| `exam-flow`는 무엇인가? | 검사 관련 **전용 UI 흐름**(일정·보드 등)을 두는 영역으로, 대시보드와 역할을 나눈다. |

### Backend

| 질문(예시) | 답변 요지 |
|:---|:---|
| 백엔드 스택은? | **Node.js**, **Express.js**, **REST** API. 엔트리는 `backend/index.js`. |
| 비즈니스 로직은 어디에 있나? | **`backend/src/`** 업무 모듈(예: `documentManagement.js`, `testManagement.js`, `prescriptionManagement.js`). |
| AI 호출은 백엔드에서 하나? | 브라우저는 **`/api/ai`** 등으로 백엔드를 호출하고, 백엔드가 **`ai-gateway`**로 **프록시**하는 구조를 쓴다. |

### DataBase

| 질문(예시) | 답변 요지 |
|:---|:---|
| DB는 무엇인가? | 개발·시연용 **SQLite**. ORM은 **Prisma**(`backend/prisma/schema.prisma`, migrations). |
| 스키마·시드는 누가 맡나? | **송유찬** 주도로 스키마·마이그레이션·시드·샘플 데이터. **김지현**은 앱에서 Prisma 클라이언트로 API와 연결. |
| 약물 데이터는? | **`DataBase/`** JSON·스크립트와 **`backend/src/drugDatabase.js`** 연계. |

### AI

| 질문(예시) | 답변 요지 |
|:---|:---|
| 어떤 AI를 쓰나? | **`ai-gateway/`**에서 **OpenAI, Anthropic, Google** 등 **다중 LLM**과 **폴백**, **Rate Limit**을 다룬다. |
| 프론트에서 직접 키를 쓰나? | 아니오. **게이트웨이·백엔드** 경로로 호출하고, 프론트는 **결과 표시·UX**(모달, 로딩, 에러)에 가깝다. |
| 어떤 기능에 AI가 붙나? | 임상노트 요약, 증상·처방·검사 관련 인사이트 등(구체 API는 `ai-gateway`·`frontend/src/api/ai.js` 참고). |

### 연동·범위·한계

| 질문(예시) | 답변 요지 |
|:---|:---|
| 실제 병원 검사실·약국과 연동되나? | **아니오.** 검사실·약국·타 기관 **실연동은 구현되어 있지 않다.** 시연·프로토타입 범위. |
| 입원(EMR)도 다루나? | **외래 중심**이며 **입원(IPD)은 범위 밖**으로 두었다. |
| 고도화는 무엇을 기준으로 하나? | 지난 학기·현장 피드백을 반영한 **네 가지 보완 축**은 **`md/고도화_계획.md`**에 정리. 대시보드 축은 반영, 나머지 축은 진행·설계 단계를 문서와 맞출 것. |

---

<a id="readme-report-docs"></a>

## 결과보고서 작성 시 참고 문서 (클릭 순서)

GitHub에서 아래 링크를 **위에서부터 순서대로** 열면, 결과보고서에 넣을 **배경 → 성과·한계 → 지도·정합** 흐름이 자연스럽다. (로컬에서는 동일 경로의 파일을 연다.)

| 순서 | 문서 | 한 줄 설명 |
|:---:|:---|:---|
| **1** | [**`md/고도화_계획.md`**](md/고도화_계획.md) | **왜** 고도화했는지: 지난 학기·전문가 피드백, **기간·네 가지 축**, 반영 vs 진행 중 구분. |
| **2** | [**`md/결과보고서.md`**](md/결과보고서.md) | **무엇을** 만들었는지: 서론·본론·결론, 화면·목표 달성, **§3-3 기술적 개선사항**까지 서술의 뼈대. |
| **3** | [**`md/세부_지도내용.md`**](md/세부_지도내용.md) | **어떻게** 지도받았는지: 회차별 지도 내용, `README`·고도화·결과보고서 간 **용어·역할 정합**. |

작성 팁: **1**에서 범위·한계를 먼저 고정하고, **2**에 구현·스크린샷·KPI를 쓰며, **3**으로 지도 일정·피드백 반영 과정을 보완한다. 저장소 **최신 요약**은 항상 이 **`README.md`**와 대조한다.
