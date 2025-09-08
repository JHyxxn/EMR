# 🚀 개발 환경 설정 가이드

## 📋 설치 순서

### **1단계: Node.js 설치 **
```
JavaScript 실행 환경
```

#### **설치 방법:**
1. **공식 사이트** 접속: https://nodejs.org/
2. **LTS 버전** 다운로드 (안정적인 버전)
3. **설치 파일 실행** → Next → Next → Install
4. **설치 완료** 확인

#### **설치 확인:**
```bash
node --version
npm --version
```

---

### **2단계: Git 설치 **
```
코드 관리 도구
```

#### **설치 방법:**
1. **공식 사이트** 접속: https://git-scm.com/
2. **OS별 설치 파일** 다운로드
3. **설치 파일 실행** → 기본 설정으로 설치
4. **설치 완료** 확인

#### **설치 확인:**
```bash
git --version
```

#### **초기 설정:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### **3단계: GitHub Desktop 설치 **
```
GitHub GUI 도구
```

#### **설치 방법:**
1. **공식 사이트** 접속: https://desktop.github.com/
2. **다운로드** 버튼 클릭
3. **설치 파일 실행** → 설치 완료
4. **GitHub 계정** 로그인

#### **설치 확인:**
- **GitHub Desktop** 실행
- **계정 연결** 확인

---

### **4단계: Cursor 설치 **
```
AI 코딩 어시스턴트
```

#### **설치 방법:**
1. **공식 사이트** 접속: https://cursor.sh/
2. **다운로드** 버튼 클릭
3. **OS별 설치 파일** 다운로드
4. **설치 파일 실행** → 설치 완료

#### **설치 확인:**
- **Cursor** 실행
- **프로젝트 열기** 테스트

---

## **설치 요약**

1. **Node.js** → JavaScript 실행 환경
2. **Git** → 코드 관리 도구
3. **GitHub Desktop** → GitHub GUI 도구
4. **Cursor** → AI 코딩 어시스턴트

---

## **설치 후 확인사항**

### **1. Node.js 확인:**
```bash
node --version
# v18.x.x 이상이어야 함

npm --version
# 9.x.x 이상이어야 함
```

### **2. Git 확인:**
```bash
git --version
# 2.x.x 이상이어야 함
```

### **3. GitHub Desktop 확인:**
- **실행** → GitHub 계정 로그인
- **프로젝트 클론** 테스트

### **4. Cursor 확인:**
- **실행** → 프로젝트 폴더 열기
- **AI 어시스턴트** 테스트 (`Ctrl+Shift+L`)

---

## **설치 시 주의사항**

### **Node.js:**
- **LTS 버전** 선택 (안정적)
- **PATH 환경변수** 자동 설정됨
- **npm**도 함께 설치됨

### **Git:**
- **기본 설정**으로 설치
- **사용자 정보** 설정 필요
- **SSH 키** 설정 (선택사항)

### **GitHub Desktop:**
- **GitHub 계정** 필요
- **2단계 인증** 설정 권장
- **프로젝트 클론** 테스트

### **Cursor:**
- **무료 버전**으로도 충분
- **GitHub 연동** 가능
- **AI 기능** 사용 가능
- **필수 설치** 프로그램

---

## **설치 완료 후 다음 단계**

### **1. 프로젝트 클론:**
- **GitHub Desktop**으로 프로젝트 다운로드
- **프로젝트 폴더** 확인

### **2. 의존성 설치:**
```bash
cd /path/to/your/3-1.EMR
npm install
```

### **3. 서비스 실행:**
```bash
npm run dev:back    # Backend
npm run dev:ai      # AI Gateway
npm run dev:front   # Frontend
```

### **4. 접속 확인:**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **AI Gateway**: http://localhost:5001

---

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

---

## 🚨 문제 해결

### **Node.js 버전 문제:**
```bash
# nvm 사용 시
nvm install 18
nvm use 18

# 또는 직접 다운로드
# https://nodejs.org/
```

### **권한 문제 (macOS/Linux):**
```bash
# npm 글로벌 패키지 권한 문제
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### **Git 연결 문제:**
```bash
# SSH 키 등록 확인
ssh -T git@github.com

# HTTPS 사용 시
git remote set-url origin https://github.com/JHyxxn/emr-demo.git
```

---

## 📚 추가 리소스

- [Node.js 공식 문서](https://nodejs.org/docs/)
- [Git 공식 문서](https://git-scm.com/doc)
- [VS Code 공식 문서](https://code.visualstudio.com/docs)
- [GitHub SSH 설정 가이드](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

---

**문제가 발생하면 Issues에 등록하거나 팀원에게 문의하세요!** 🆘
