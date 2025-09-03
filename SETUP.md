# 🚀 개발 환경 설정 가이드

## 📋 사전 요구사항

### 필수 소프트웨어
- **Node.js 18+** (LTS 버전 권장)
- **Git** (버전 관리)
- **npm** 또는 **pnpm** (패키지 관리자)

### 권장 개발 도구
- **VS Code** (코드 에디터)
- **Postman** (API 테스트)
- **GitHub Desktop** (Git GUI, 선택사항)

## 🔧 환경 설정 단계

### 1) Node.js 설치 확인
```bash
# Node.js 버전 확인
node --version
# v18.0.0 이상이어야 함

# npm 버전 확인
npm --version
# v8.0.0 이상이어야 함
```

### 2) Git 설정
```bash
# Git 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# SSH 키 생성 (GitHub 연동용)
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### 3) VS Code 확장 프로그램 설치
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **GitLens**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

## 📁 프로젝트 구조

```
3-1.EMR/
├── ai-gateway/          # AI 진료 지원 서비스
├── backend/             # 백엔드 API 서버
├── frontend/            # React 프론트엔드
├── .gitignore          # Git 제외 파일 목록
├── README.md           # 프로젝트 개요
├── SETUP.md            # 이 파일 (환경 설정 가이드)
└── LICENSE             # MIT 라이선스
```

## 🔑 환경변수 설정

### AI Gateway
```bash
cd ai-gateway
cp .env.example .env
# .env 파일에 필요한 API 키 설정
```

### Backend
```bash
cd backend
cp .env.example .env
# .env 파일에 데이터베이스 연결 정보 설정
```

### Frontend
```bash
cd frontend
cp .env.example .env
# .env 파일에 API 엔드포인트 설정
```

## 🚨 문제 해결

### Node.js 버전 문제
```bash
# nvm 사용 시
nvm install 18
nvm use 18

# 또는 직접 다운로드
# https://nodejs.org/
```

### 권한 문제 (macOS/Linux)
```bash
# npm 글로벌 패키지 권한 문제
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Git 연결 문제
```bash
# SSH 키 등록 확인
ssh -T git@github.com

# HTTPS 사용 시
git remote set-url origin https://github.com/JHyxxn/emr-demo.git
```

## 📚 추가 리소스

- [Node.js 공식 문서](https://nodejs.org/docs/)
- [Git 공식 문서](https://git-scm.com/doc)
- [VS Code 공식 문서](https://code.visualstudio.com/docs)
- [GitHub SSH 설정 가이드](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

---

**문제가 발생하면 Issues에 등록하거나 팀원에게 문의하세요!** 🆘
