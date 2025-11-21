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
- **[`frontend/src/components/dashboard/Dashboard.tsx`](frontend/src/components/dashboard/Dashboard.tsx)**
  - 대시보드 메인 컴포넌트
  - 금일 대기 환자 목록 관리
  - 진료 시작/완료 버튼 동작
  - 실시간 시간 표시 및 운영시간 관리
  - 환자 상태 관리 (대기 중, 진료 중, 완료)

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
  - 검사 관리 페이지
  - 검사 오더 관리
  - 검사 결과 입력
  - AI 기반 검사 결과 분석

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

### 이윤효 (백엔드) 담당 파일

#### 서버 및 API
- **[`backend/index.js`](backend/index.js)**
  - FastAPI 백엔드 서버 메인 파일
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

### 김종원 (데이터 생성) 담당 파일

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

- **[`Downloads/drug_dataset_500.json`](Downloads/drug_dataset_500.json)**
  - 약물 데이터베이스 (500개 약물 정보)

### 김지현 (AI Gateway) 담당 파일

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

## ❓ 예상 질의응답

### 🌐 전체 프로그램 관련 질문

**예상 질문:**
- "실제 병원에서 사용할 수 있는 수준이라고 했는데, 의료 인증이나 규제는 어떻게 통과할 수 있나요?"
- "HIPAA나 개인정보보호법 같은 의료 데이터 보호 규정을 준수했나요?"
- "시스템의 확장성은 어떻게 고려했나요? 실제 병원 규모(수천 명 환자)에서도 작동하나요?"
- "다른 EMR 시스템과 비교했을 때 차별점이 무엇인가요? 기존 시스템 대비 어떤 장점이 있나요?"
- "실제 병원에서 테스트해본 적이 있나요? 의료진 피드백은 받았나요?"
- "시스템의 가용성(availability)은 어떻게 보장하나요? 서버가 다운되면 어떻게 하나요?"
- "데이터 마이그레이션은 어떻게 하나요? 기존 EMR 시스템에서 데이터를 가져올 수 있나요?"
- "코드 품질 관리는 어떻게 했나요? 테스트 코드는 작성했나요?"
- "성능 테스트는 했나요? 동시 접속자 수는 얼마나 지원하나요?"
- "오픈소스인가요? 라이선스는 무엇인가요?"

**대답 전략:**
- "현재는 프로토타입 단계이며, 실제 병원 배포를 위해서는 의료 인증 및 규제 준수를 위한 추가 개발이 필요합니다."
- "개인정보보호를 위해 데이터 암호화와 접근 권한 관리를 구현했으며, 실제 서비스에서는 HIPAA 등 규정을 완전히 준수하도록 개선할 예정입니다."
- "현재는 50명 규모로 테스트했으며, 확장성을 위해 데이터베이스 인덱싱과 캐싱 전략을 고려했습니다."
- "AI 기반 의료진 보조 기능과 실시간 대시보드가 주요 차별점입니다."
- "실제 병원 테스트는 향후 계획이며, 현재는 시뮬레이션 데이터로 검증했습니다."
- "가용성 향상을 위해 로드 밸런싱과 백업 서버 구축을 계획하고 있습니다."
- "데이터 마이그레이션 기능은 향후 개발 예정입니다."
- "코드 리뷰와 정기적인 회의를 통해 품질을 관리했으며, 테스트 코드는 핵심 기능에 대해 작성했습니다."
- "성능 테스트는 기본적인 수준에서 진행했으며, 실제 운영 환경에서는 추가 최적화가 필요합니다."

---

### AI-Gateway 관련 질문 (김지현 담당)

**예상 질문:**
- "AI 분석이 정확한가? 의료진이 신뢰할 수 있는 수준인가?"
- "AI가 잘못된 진단을 내리면 어떻게 책임질 것인가?"
- "실제 의료 데이터로 검증해봤는가?"
- "AI 모델의 정확도는 얼마나 되나요? 벤치마크 테스트 결과는?"
- "다중 AI 모델을 사용하는 이유가 무엇인가요? 비용이 많이 들지 않나요?"
- "Rate Limit이 1분당 30개인데, 실제 병원에서 충분한가요?"
- "AI 응답 시간은 얼마나 걸리나요? 실시간 진료에 지장이 없나요?"
- "AI 모델이 업데이트되면 어떻게 대응하나요?"
- "약물 상호작용 검증 로직의 의학적 근거는 무엇인가요? 의료진이 검토했나요?"
- "AI가 생성한 소견서의 법적 효력은 어떻게 보장하나요?"

**대답 전략:**
- "저희는 AI를 보조 도구로만 사용했습니다. 최종 진단은 의료진이 내리도록 설계했고, AI는 단순히 이상 수치를 시각적으로 표시하는 역할만 합니다."
- "실제 의료 데이터는 사용할 수가 없어, 시뮬레이션 데이터로만 테스트했습니다."
- "다중 AI 모델을 사용하는 이유는 각 모델의 강점을 활용하고, 한 모델이 실패할 경우 자동 폴백을 제공하기 위함입니다."
- "Rate Limit은 현재 설정이며, 실제 운영 환경에서는 모델별로 최적화할 예정입니다."
- "AI 응답 시간은 평균 2-3초이며, 비동기 처리로 사용자 경험에 지장을 주지 않도록 구현했습니다."
- "약물 상호작용 검증은 공공 의료 데이터와 의학 지식을 기반으로 구현했으며, 실제 서비스에서는 전문가 검토가 필요합니다."

---

### Backend 관련 질문 (이윤효 담당)

**예상 질문:**
- "데이터 보안은 어떻게 처리했는가?"
- "동시에 여러 의료진이 접속할 때 데이터 충돌은 어떻게 방지했는가?"
- "백업 시스템은 있는가?"
- "SQLite를 사용한 이유가 무엇인가요? 실제 병원에서는 PostgreSQL이나 MySQL을 사용하지 않나요?"
- "트랜잭션 처리는 어떻게 구현했나요? ACID 속성을 보장하나요?"
- "API 응답 시간은 얼마나 걸리나요? 병목 지점은 어디인가요?"
- "데이터베이스 인덱싱은 어떻게 했나요? 쿼리 최적화는?"
- "에러 핸들링은 어떻게 했나요? 예외 상황에서도 안정적으로 작동하나요?"
- "로그 관리 시스템은 있나요? 디버깅은 어떻게 하나요?"
- "API 버전 관리 전략은 무엇인가요? 하위 호환성은 보장하나요?"
- "환자 데이터 삭제 요청 시 어떻게 처리하나요? 완전 삭제인가요, 논리 삭제인가요?"

**대답 전략:**
- "현재는 프로토타입 단계로 로컬 SQLite를 사용했습니다. 실제 서비스에서는 PostgreSQL 등 프로덕션급 데이터베이스로 전환할 예정입니다."
- "동시 접속 시 데이터 무결성을 위해 Prisma ORM의 트랜잭션 처리를 활용했습니다."
- "백업은 현재 수동으로 하고 있으며, 실제 서비스에서는 자동 백업 시스템을 구축할 예정입니다."
- "SQLite는 개발 및 테스트 단계에서 빠른 프로토타이핑을 위해 선택했으며, 실제 운영 환경에서는 확장 가능한 데이터베이스로 마이그레이션할 예정입니다."
- "Prisma ORM을 통해 트랜잭션을 관리하며, ACID 속성을 보장합니다."
- "API 응답 시간은 평균 100-200ms이며, 데이터베이스 쿼리 최적화를 통해 성능을 개선했습니다."
- "Prisma 스키마에서 인덱스를 정의했으며, 자주 조회되는 필드에 대해 인덱싱했습니다."
- "try-catch 블록과 에러 미들웨어를 통해 에러를 처리하며, 사용자에게 적절한 에러 메시지를 반환합니다."

---

### Frontend 관련 질문 (이희창 담당)

**예상 질문:**
- "사용자 경험이 실제 의료진에게 적합한가?"
- "접근성은 고려했는가?"
- "모바일 환경에서도 사용 가능한가?"
- "React의 리렌더링 최적화는 어떻게 했나요? 성능 문제는 없나요?"
- "상태 관리가 복잡한데, Context API만으로 충분한가요? Redux를 고려하지 않았나요?"
- "TypeScript를 사용했는데, 타입 안정성을 100% 보장하나요? any 타입을 사용한 부분은?"
- "컴포넌트 재사용성은 어떻게 고려했나요? 중복 코드는 없나요?"
- "브라우저 호환성은 어떤가요? 구형 브라우저에서도 작동하나요?"
- "번들 크기는 얼마나 되나요? 초기 로딩 시간은?"
- "실시간 업데이트는 어떻게 구현했나요? WebSocket을 사용했나요?"
- "폼 유효성 검사는 클라이언트와 서버 양쪽에서 하나요?"
- "에러 바운더리는 구현했나요? 예외 상황에서 앱이 크래시되지 않나요?"

**대답 전략:**
- "실제 의료 경험을 바탕으로 의료진이 실제로 사용하는 업무 흐름을 분석하여 UI/UX를 설계했습니다. 복잡한 의료 정보를 한눈에 볼 수 있도록 레이아웃을 구성했습니다."
- "현재는 데스크톱 환경에 최적화되어 있으며, 모바일 대응은 향후 개발 예정입니다."
- "접근성은 기본적인 키보드 네비게이션을 지원하도록 구현했습니다."
- "React.memo와 useMemo, useCallback을 활용하여 불필요한 리렌더링을 방지했습니다."
- "현재 프로젝트 규모에서는 Context API로 충분하며, 필요시 Redux로 전환할 수 있도록 구조화했습니다."
- "TypeScript를 통해 타입 안정성을 높였으며, any 타입은 외부 API 응답 등 제한적인 경우에만 사용했습니다."
- "공통 컴포넌트를 분리하여 재사용성을 높였으며, props를 통해 커스터마이징 가능하도록 설계했습니다."
- "최신 브라우저(Chrome, Firefox, Safari 최신 버전)를 대상으로 개발했으며, 구형 브라우저 지원은 polyfill을 통해 가능합니다."
- "Vite를 사용하여 번들 크기를 최적화했으며, 코드 스플리팅을 통해 초기 로딩 시간을 단축했습니다."
- "현재는 폴링 방식으로 실시간성을 구현했으며, 향후 WebSocket 도입을 고려하고 있습니다."

---

### 데이터 생성 관련 질문 (김종원 담당)

**예상 질문:**
- "약물 데이터의 정확성은 어떻게 보장하는가?"
- "데이터 업데이트는 어떻게 관리하는가?"
- "약물 상호작용 검증의 근거는 무엇인가?"
- "50명 환자 데이터를 수작업으로 만들었다고 했는데, 실제 병원 규모(수천 명)에서는 어떻게 하나요?"
- "데이터 생성 알고리즘의 의학적 정확성은 어떻게 보장하나요? 의료진이 검토했나요?"
- "중복 환자 데이터는 어떻게 처리하나요? 실제로 동명이인을 구분할 수 있나요?"
- "데이터 생성기의 재현성(reproducibility)은 보장하나요? 같은 입력에 대해 항상 같은 결과가 나오나요?"
- "생성된 데이터의 통계적 분포는 실제 환자 데이터와 유사한가요?"
- "데이터 검증 로직은 무엇인가요? 잘못된 데이터가 생성되지 않나요?"
- "약물 데이터 500개는 충분한가요? 실제로는 수만 개의 약물이 있는데?"

**대답 전략:**
- "공공 의료 데이터 포털의 공식 데이터를 사용했습니다."
- "현재는 수동으로 업데이트하며, 향후 자동화 시스템을 구축할 예정입니다."
- "약물 상호작용은 기본적인 알고리즘으로 구현했으며 가지고 있는 지식의 약물 위주로 만들었습니다."
- "50명은 프로토타입 테스트를 위한 규모이며, 실제 운영 환경에서는 대량 데이터 생성 알고리즘을 확장할 예정입니다."
- "데이터 생성 알고리즘은 의학적 지식을 기반으로 구현했으며, 실제 서비스에서는 전문가 검토가 필요합니다."
- "중복 환자는 생년월일과 전화번호 뒷자리로 구분하도록 구현했습니다."
- "랜덤 시드를 사용하여 재현 가능하도록 구현했으며, 테스트 시 동일한 결과를 얻을 수 있습니다."
- "생성된 데이터는 실제 환자 데이터의 통계적 특성(연령 분포, 질병 분포 등)을 반영하도록 설계했습니다."
- "데이터 검증 로직을 통해 유효하지 않은 데이터(예: 미래 생년월일, 음수 나이 등)를 필터링합니다."
- "500개 약물은 프로토타입 단계이며, 실제 서비스에서는 전체 약물 데이터베이스를 연동할 예정입니다."

---

### 공통 대답 전략

**실제 의료 경험 활용**
- "실제 의료 경험을 바탕으로 의료진이 실제로 사용하는 업무 흐름을 분석하여 시스템을 설계했습니다."
- "의료진의 실제 업무 환경을 고려하여 사용자 친화적인 인터페이스를 구현했습니다."

**기술적 한계 인정**
- "현재는 프로토타입 단계로, 실제 임상 환경에서는 추가 검증이 필요합니다."
- "실제 의료 데이터는 사용하지 않고 시뮬레이션으로만 테스트했습니다."
- "프로덕션 환경을 위한 추가 개발과 검증이 필요합니다."

**향후 개선 계획**
- "실제 병원 환경에서의 테스트와 피드백을 반영하여 지속적으로 개선할 예정입니다."
- "의료 인증 및 규제 준수를 위한 추가 개발을 계획하고 있습니다."

**팀워크 강조**
- "각자 전문 분야를 담당하여 효율적으로 개발했습니다."
- "정기적인 코드 리뷰와 회의를 통해 품질을 관리했습니다."
- "Git을 통한 버전 관리와 협업을 통해 체계적으로 프로젝트를 진행했습니다."
