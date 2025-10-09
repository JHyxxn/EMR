# 약물 데이터베이스 수집기 사용법

## 개요
한국 식품의약품안전처의 DUR(OpenAPI)과 의약품개요정보(OpenAPI)를 활용하여 약물 상호작용 데이터를 수집하는 Python 스크립트입니다.

## 설치 및 설정

### 1. 필요한 패키지 설치
```bash
pip install -r requirements_drug_collector.txt
```

### 2. API 키 설정
1. [data.go.kr](https://data.go.kr)에서 회원가입
2. DUR API와 의약품개요정보 API 신청
3. API 키 발급받기
4. `.env` 파일 생성:
```bash
cp env_example.txt .env
```
5. `.env` 파일에 API 키 입력:
```
DATA_GO_KR_API_KEY=your_actual_api_key_here
```

## 사용법

### 기본 실행
```bash
python drug_database_collector.py
```

### 실행 결과
- `hypertension_diabetes_drugs.csv`: 고혈압/당뇨 관련 약물 데이터
- 로그: 실시간 진행 상황 확인

## 출력 데이터 형식

| drug_name | ingredient | interaction_type | caution_text |
|------------|-------------|------------------|---------------|
| 아몰디핀정 | Amlodipine | 병용금기 | 베타차단제 병용 시 저혈압 유발 가능 |
| 다이아벡스정 | Metformin | 주의 | 신장기능 저하 환자 투여 주의 |

## 주요 기능

### 1. DUR 데이터 수집
- 약물 상호작용 정보
- 병용금기 정보
- 주의사항 정보

### 2. 의약품 개요정보 통합
- 성분명 정보
- 추가 주의사항
- 약물 상세 정보

### 3. 고혈압/당뇨 약물 필터링
- ACE 억제제
- ARB (안지오텐신 수용체 차단제)
- 베타차단제
- 메트포르민
- 설포닐우레아 등

### 4. 데이터 처리
- 중복 제거
- 빈 값 정리
- UTF-8 인코딩

## API 제한사항
- API 호출 간격: 0.3초 (서버 부하 방지)
- 최대 페이지 수: 20페이지 (테스트용)
- 타임아웃: 30초

## 오류 처리
- API 호출 실패 시 재시도
- 네트워크 오류 처리
- 데이터 파싱 오류 처리
- 로깅을 통한 진행 상황 추적

## 확장 가능성
- 다른 질병군 약물 필터링
- 추가 API 통합
- 실시간 데이터 업데이트
- 데이터베이스 연동
