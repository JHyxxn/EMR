# AI Gateway - 의료 지원 AI 시스템

AI Gateway는 EMR 시스템을 위한 다중 AI 모델 지원 게이트웨이입니다. 여러 AI 제공업체의 모델을 통합하여 의료진에게 AI 기반 의료 지원 서비스를 제공합니다.

## 주요 기능

### 1. 임상노트 요약
- 환자의 문진 내용을 AI가 분석하여 요약 제공
- 위험 신호 감지 및 권장사항 제시

### 2. 증상 분석 AI
- 환자 증상과 관찰치를 바탕으로 가능한 진단 추천
- 추가 검사 권장사항 제공

### 3. 처방 가이드
- 약물 상호작용 분석
- 용량 가이드 및 주의사항 제공
- 모니터링 권장사항

### 4. Lab/바이탈 요약
- 관찰치 임계값 기반 플래그 생성
- 특이사항 요약 제공

## 지원 AI 모델

- **OpenAI**: GPT-4o, GPT-4o-mini, GPT-3.5-turbo
- **Anthropic Claude**: Claude-3.5-Sonnet, Claude-3-Haiku, Claude-3-Opus
- **Google Gemini**: Gemini-1.5-Pro, Gemini-1.5-Flash, Gemini-1.0-Pro

## 설치 및 실행

### 1. 의존성 설치
```bash
cd ai-gateway
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일에 API 키를 설정하세요:
```env
# 서버 설정
PORT=5001

# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Claude API 설정
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Gemini API 설정
GOOGLE_API_KEY=your_google_api_key_here

# 기본 AI 모델 설정
AI_MODEL=gpt-4o-mini
```

### 3. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

### 헬스체크
```bash
GET /health
```

### AI 모델 상태 확인
```bash
GET /models/status
```

### 임상노트 요약
```bash
POST /insight/clinical-note?provider=auto
Content-Type: application/json

{
  "text": "문진 내용",
  "patient": {
    "name": "환자명",
    "age": 45,
    "sex": "남성"
  }
}
```

### 증상 분석
```bash
POST /insight/symptom-analysis?provider=auto
Content-Type: application/json

{
  "symptoms": ["두통", "발열"],
  "patient": {
    "name": "환자명",
    "age": 35,
    "sex": "여성"
  },
  "observations": [
    {"codeLoinc": "TEMP", "value": "38.5", "unit": "°C"}
  ]
}
```

### 처방 가이드
```bash
POST /insight/prescription-guide?provider=auto
Content-Type: application/json

{
  "medications": ["아스피린", "이부프로펜"],
  "patient": {
    "name": "환자명",
    "age": 60,
    "weight": 70
  },
  "currentMedications": ["메트포르민"]
}
```

### Lab/바이탈 요약
```bash
POST /insight/lab-summary
Content-Type: application/json

{
  "observations": [
    {"codeLoinc": "BP-SYS", "value": "140", "unit": "mmHg"}
  ]
}
```

## Provider 옵션

- `auto`: 자동 폴백 (OpenAI → Anthropic → Google → Rule)
- `openai`: OpenAI 모델만 사용
- `anthropic`: Anthropic Claude 모델만 사용
- `google`: Google Gemini 모델만 사용
- `rule`: 룰 기반 폴백 (AI 모델 사용 안함)

## 통합 방법

### 백엔드 통합
백엔드는 AI Gateway를 프록시로 사용합니다:
- `http://localhost:4000/api/ai/*` → `http://localhost:5001/insight/*`

### 프론트엔드 통합
프론트엔드에서는 백엔드 API를 통해 AI 기능을 사용합니다:
```javascript
import { clinicalNote, symptomAnalysis, prescriptionGuide } from './api/ai';

// 임상노트 요약
const result = await clinicalNote({
  text: "문진 내용",
  patient: { name: "환자명", age: 45 }
}, { provider: "auto" });
```

## 보안 고려사항

- API 키는 환경 변수로 관리
- 의료 정보는 로컬에서만 처리
- AI 응답은 참고용이며 최종 진단은 의료진이 판단
- 모든 AI 응답에 의학적 단정 금지 경고 포함

## 문제 해결

### AI 모델 연결 실패
1. API 키가 올바르게 설정되었는지 확인
2. 네트워크 연결 상태 확인
3. AI 모델 상태 확인: `GET /models/status`

### 서버 시작 실패
1. 포트 5001이 사용 중인지 확인
2. 환경 변수 설정 확인
3. 의존성 설치 확인: `npm install`

## 라이선스

이 프로젝트는 의료용으로 개발되었으며, 상업적 사용 시 관련 라이선스를 확인하세요.
