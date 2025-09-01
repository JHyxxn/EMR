# EMR 시스템 컴포넌트 구조

이 문서는 EMR 시스템의 컴포넌트 구조와 각 폴더의 역할을 설명합니다.

## 📁 폴더 구조

### 🏠 **dashboard/** - 메인 대시보드 관련
- `Dashboard.tsx` - 메인 대시보드 컴포넌트
- `AlertsSection.tsx` - 미완료/최근알림 섹션
- `Calendar.tsx` - 오른쪽 사이드바 캘린더
- `QuickActions.tsx` - 빠른 액션 버튼들

### 👤 **patient-registration/** - 신규 환자 등록 관련
- `NewPatientModal.tsx` - 신규 환자 등록 모달 (메인)
- `PatientBasicInfo.tsx` - 환자 기본 정보 입력
- `VitalInput.tsx` - 바이탈 사인 입력
- `PatientSummary.tsx` - 환자 기본정보 + 최근 바이탈 요약
- `VisitInfo.tsx` - 방문 정보 입력
- `PatientNotes.tsx` - AI 요약 노트

### 🎨 **common/** - 공통 UI 컴포넌트
- `Input.jsx` - 입력 필드 컴포넌트
- `TextArea.jsx` - 텍스트 영역 컴포넌트
- `Button.jsx` - 버튼 컴포넌트
- `Card.jsx` - 카드 컴포넌트
- `SectionTitle.jsx` - 섹션 제목 컴포넌트
- `ListRow.jsx` - 리스트 행 컴포넌트
- `Tabs.jsx` - 탭 컴포넌트

### 🏗️ **layout/** - 레이아웃 컴포넌트
- `Header.tsx` - 메인 헤더 (로고, 검색, 사용자 정보)
- `Sidebar.tsx` - 왼쪽 네비게이션 사이드바

### 🔐 **auth/** - 인증 관련 컴포넌트
- `LoginModal.tsx` - 로그인 모달
- `SearchBar.tsx` - 환자 검색 바

### 📋 **patient-chart/** - 환자 차트 관련
- `ClinicalNoteCard.jsx` - 임상 노트 카드

## 📝 사용법

### Import 예시
```typescript
// 대시보드 컴포넌트 사용
import { Dashboard, Calendar, QuickActions } from '@/components/dashboard';

// 신규 환자 등록 컴포넌트 사용
import { NewPatientModal, PatientBasicInfo } from '@/components/patient-registration';

// 공통 UI 컴포넌트 사용
import { Input, Button, Card } from '@/components/common';

// 레이아웃 컴포넌트 사용
import { Header, Sidebar } from '@/components/layout';
```

### 또는 메인 index에서 한 번에 import
```typescript
import { 
  Dashboard, 
  NewPatientModal, 
  Input, 
  Header 
} from '@/components';
```

## 🔄 컴포넌트 추가 시 규칙

1. **새로운 기능 추가 시**: 해당 기능에 맞는 폴더에 추가
2. **공통 컴포넌트 추가 시**: `common/` 폴더에 추가
3. **각 폴더의 index.ts 파일 업데이트**: 새로운 컴포넌트 export 추가
4. **메인 index.ts 파일 업데이트**: 필요시 전체 export 추가

## 📋 파일 네이밍 규칙

- **React 컴포넌트**: PascalCase (예: `PatientBasicInfo.tsx`)
- **일반 유틸리티**: camelCase (예: `validationUtils.ts`)
- **상수/설정**: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)
- **타입 정의**: PascalCase (예: `PatientTypes.ts`)

## 🎯 주요 특징

- **모듈화**: 기능별로 명확하게 분리
- **재사용성**: 공통 컴포넌트는 `common/` 폴더에서 관리
- **확장성**: 새로운 기능 추가 시 해당 폴더에 쉽게 추가 가능
- **가독성**: 팀원들이 쉽게 이해할 수 있는 구조
