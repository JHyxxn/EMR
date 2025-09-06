# 🏃‍♂️ 프로젝트 실행 가이드

## 🚀 빠른 시작 (Quick Start)

### 1) 프로젝트 클론

#### **GitHub Desktop 사용 (추천)**
- **`TEAM_WORKFLOW.md`** 참조: GitHub Desktop 설치 및 사용법
- **GUI로 쉽게** 프로젝트 클론 및 관리

#### **터미널 단축키 설정 (선택사항)**
```bash
# 터미널 단축키 설정 (프로젝트 폴더로 이동)
alias emr-dev="cd /path/to/your/3-1.EMR"

# 사용법: 터미널에서 "emr-dev" 입력하면 프로젝트 폴더로 이동
# 그 후 아래 명령어로 서비스 실행:
# npm run dev:back    # Backend만 실행
# npm run dev:ai      # AI Gateway만 실행  
# npm run dev:front   # Frontend만 실행
```

### 2) 모든 의존성 설치 (한 번에)
```bash
# 루트에서 모든 패키지 설치
npm install
cd ai-gateway && npm install && cd ..
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3) 모든 서비스 실행 (3개 터미널 필요)
```bash
# 터미널 1: AI Gateway
cd ai-gateway
npm start

# 터미널 2: Backend
cd backend
npm run dev

# 터미널 3: Frontend
cd frontend
npm run dev
```

## 📱 접속 확인

| 서비스 | URL | 상태 확인 |
|--------|-----|-----------|
| **Frontend** | `http://localhost:5173` | 브라우저에서 환자 검색 화면 |
| **Backend** | `http://localhost:3000` | API 서버 응답 |
| **AI Gateway** | `http://localhost:5000` | AI 서비스 상태 |

## 🔧 상세 실행 단계

### Phase 1: AI Gateway 실행
```bash
cd ai-gateway

# 의존성 설치
npm install

# 환경변수 설정 (필요시)
cp .env.example .env
# .env 파일에 API 키 설정

# 서비스 시작
npm start

# 성공 메시지 확인
# "AI Gateway running on port 5000"
```

### Phase 2: Backend 실행
```bash
cd backend

# 의존성 설치
npm install

# 데이터베이스 설정
npx prisma generate
npx prisma migrate dev

# 환경변수 설정 (필요시)
cp .env.example .env
# .env 파일에 DB 연결 정보 설정

# 개발 서버 시작
npm run dev

# 성공 메시지 확인
# "Server running on port 3000"
```

### Phase 3: Frontend 실행
```bash
cd frontend

# 의존성 설치
npm install

# 환경변수 설정 (필요시)
cp .env.example .env
# .env 파일에 API 엔드포인트 설정

# 개발 서버 시작
npm run dev

# 성공 메시지 확인
# "Local: http://localhost:5173/"
```

## 🧪 기능 테스트

### 1) Frontend 기본 동작 확인
- [ ] `http://localhost:5173` 접속
- [ ] 환자 검색 화면 표시
- [ ] 로그인 모달 동작
- [ ] 사이드바 메뉴 동작

### 2) Backend API 테스트
```bash
# 환자 목록 조회
curl http://localhost:3000/api/patients

# 상태 확인
curl http://localhost:3000/health
```

### 3) AI Gateway 테스트
```bash
# 서비스 상태 확인
curl http://localhost:5000/health

# AI 응답 테스트
curl -X POST http://localhost:5000/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "환자 증상 분석"}'
```

## 🚨 문제 해결

### 포트 충돌 문제
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :5000
lsof -i :5173

# 프로세스 종료
kill -9 [PID]
```

### 데이터베이스 연결 문제
```bash
cd backend
# SQLite 파일 확인
ls -la prisma/

# 마이그레이션 재실행
npx prisma migrate reset
npx prisma migrate dev
```

### 패키지 설치 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm cache clean --force
```

## 📊 성능 모니터링

### 메모리 사용량 확인
```bash
# Node.js 프로세스 메모리 사용량
ps aux | grep node

# 포트별 연결 상태
netstat -an | grep LISTEN
```

### 로그 확인
```bash
# Backend 로그
cd backend && npm run dev

# AI Gateway 로그  
cd ai-gateway && npm start

# Frontend 빌드 로그
cd frontend && npm run build
```

## 🔄 개발 모드 vs 프로덕션 모드

### 개발 모드 (현재)
- Hot Reload 활성화
- 디버그 로그 출력
- 소스맵 생성
- 에러 상세 정보

### 프로덕션 모드
```bash
# Frontend 빌드
cd frontend
npm run build

# Backend 프로덕션 모드
cd backend
NODE_ENV=production npm start
```

## 📱 모바일 테스트

### 로컬 네트워크 접속
```bash
# IP 주소 확인
ifconfig | grep "inet "

# Frontend를 네트워크에 노출
cd frontend
npm run dev -- --host 0.0.0.0
```

### 접속 URL
- `http://[YOUR_IP]:5173` (같은 WiFi 네트워크)

---

## 🎯 다음 단계

실행이 성공적으로 완료되면:
1. **기능 테스트** - 각 기능이 정상 동작하는지 확인
2. **데이터 입력** - 샘플 환자 데이터 추가
3. **UI/UX 개선** - 사용자 경험 향상
4. **성능 최적화** - 로딩 속도 개선

**문제가 발생하면 팀원에게 문의하거나 Issues에 등록하세요!** 🆘
