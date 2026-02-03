/**
 * 환자 데이터 생성기 (50명 + 금일 대기 환자 15명)
 * 
 * 담당자: 조형석 (데이터 생성)
 * 
 * 주요 기능:
 * - 50명 환자 데이터 생성
 * - 금일 대기 환자 15명 생성
 * - 환자 기본 정보 생성 (이름, 생년월일, 전화번호, 주소 등)
 * - 진료 이력 생성
 * - 알레르기 정보 생성
 * - 통계 정보 생성
 * - JSON 파일 저장
 * 
 * 기술 스택:
 * - Node.js
 * - 파일 시스템 (fs)
 * - JSON 데이터 생성
 * - 랜덤 데이터 생성 알고리즘
 * 
 * 생성 데이터:
 * - 환자 기본 정보 (MRN, 이름, 생년월일, 성별, 연락처 등)
 * - 진료 이력 (방문일, 질병, 증상, 처방 약물)
 * - 알레르기 정보
 * - 대기 환자 정보 (도착 시간, 증상, 우선순위)
 * 
 * 출력 파일:
 * - patient_data_50_with_waiting.json
 */

import fs from 'fs';
import path from 'path';

class PatientDataGenerator50 {
    constructor() {
        // 한국 성씨 (상위 20개)
        this.lastNames = [
            '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
            '한', '오', '서', '신', '권', '황', '안', '송', '전', '고'
        ];
        
        // 한국 이름 (남성)
        this.maleNames = [
            '민수', '영수', '철수', '준호', '성호', '동호', '현우', '지훈', '민호', '준영',
            '성민', '동현', '현수', '지호', '민철', '영호', '철호', '준수', '성수', '동수'
        ];
        
        // 한국 이름 (여성)
        this.femaleNames = [
            '영희', '민희', '순희', '정희', '영숙', '민숙', '순숙', '정숙', '영자', '민자',
            '순자', '정자', '영미', '민미', '순미', '정미', '영주', '민주', '순주', '정주'
        ];
        
        // 질병 목록
        this.diseases = [
            '고혈압', '당뇨병', '감기', '위염', '두통', '요통', '관절염', '천식', '알레르기', '불면증',
            '우울증', '불안장애', '심장질환', '간질환', '신장질환', '갑상선질환', '류마티스', '골다공증'
        ];
        
        // 증상 목록
        this.symptoms = [
            '두통', '어지러움', '구토', '복통', '가슴통증', '호흡곤란', '기침', '콧물', '인후통', '발열',
            '오한', '피로감', '불면', '식욕부진', '소화불량', '설사', '변비', '요통', '관절통', '근육통'
        ];
        
        // 약물 목록
        this.medications = [
            '아몰디핀정', '로사르탄정', '메토프롤롤정', '캅토프릴정', '발사르탄정',
            '다이아벡스정', '글리메피리드정', '글리피지드정', '시타글립틴정', '인슐린',
            '아세트아미노펜', '이부프로펜', '아스피린', '오메프라졸', '란소프라졸'
        ];
    }
    
    /**
     * 랜덤 날짜 생성 (1950년 ~ 2010년)
     */
    generateRandomBirthDate() {
        const startYear = 1950;
        const endYear = 2010;
        const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        
        return new Date(year, month - 1, day);
    }
    
    /**
     * 랜덤 전화번호 생성
     */
    generateRandomPhone() {
        const prefixes = ['010', '011', '016', '017', '018', '019'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const middle = Math.floor(Math.random() * 9000) + 1000;
        const last = Math.floor(Math.random() * 9000) + 1000;
        
        return `${prefix}-${middle}-${last}`;
    }
    
    /**
     * 랜덤 주소 생성
     */
    generateRandomAddress() {
        const cities = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시'];
        const districts = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구'];
        const streets = ['테헤란로', '강남대로', '서초대로', '반포대로', '논현로', '역삼로', '삼성로', '봉은사로'];
        
        const city = cities[Math.floor(Math.random() * cities.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const building = Math.floor(Math.random() * 200) + 1;
        const room = Math.floor(Math.random() * 100) + 1;
        
        return `${city} ${district} ${street} ${building}번길 ${room}호`;
    }
    
    /**
     * MRN 생성 (의료기록번호)
     */
    generateMRN(index) {
        const year = new Date().getFullYear();
        const paddedIndex = String(index).padStart(4, '0');
        return `MRN${year}${paddedIndex}`;
    }
    
    /**
     * 랜덤 성별 생성
     */
    generateRandomSex() {
        return Math.random() < 0.5 ? 'M' : 'F';
    }
    
    /**
     * 랜덤 이름 생성
     */
    generateRandomName(sex) {
        const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        const firstName = sex === 'M' 
            ? this.maleNames[Math.floor(Math.random() * this.maleNames.length)]
            : this.femaleNames[Math.floor(Math.random() * this.femaleNames.length)];
        
        return `${lastName}${firstName}`;
    }
    
    /**
     * 랜덤 이메일 생성
     */
    generateRandomEmail(name) {
        const domains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net', 'yahoo.com'];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const randomNum = Math.floor(Math.random() * 1000);
        
        return `${name}${randomNum}@${domain}`;
    }
    
    /**
     * 랜덤 보험번호 생성
     */
    generateRandomInsuranceNo() {
        const prefix = Math.floor(Math.random() * 90) + 10;
        const middle = Math.floor(Math.random() * 900000) + 100000;
        const last = Math.floor(Math.random() * 90) + 10;
        
        return `${prefix}${middle}${last}`;
    }
    
    /**
     * 랜덤 알레르기 생성
     */
    generateRandomAllergies() {
        const allergies = ['페니실린', '아스피린', '설폰아미드', '세파클로르', '에리트로마이신', '없음'];
        const hasAllergy = Math.random() < 0.3;
        
        if (!hasAllergy) return [];
        
        const numAllergies = Math.floor(Math.random() * 3) + 1;
        const selectedAllergies = [];
        
        for (let i = 0; i < numAllergies; i++) {
            const allergy = allergies[Math.floor(Math.random() * allergies.length)];
            if (allergy !== '없음' && !selectedAllergies.includes(allergy)) {
                selectedAllergies.push(allergy);
            }
        }
        
        return selectedAllergies.length > 0 ? selectedAllergies : ['없음'];
    }
    
    /**
     * 랜덤 진료 기록 생성
     */
    generateRandomMedicalHistory() {
        const numVisits = Math.floor(Math.random() * 3) + 1; // 1-3번 방문
        const visits = [];
        
        for (let i = 0; i < numVisits; i++) {
            const visitDate = new Date();
            visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 365));
            
            const disease = this.diseases[Math.floor(Math.random() * this.diseases.length)];
            const symptom = this.symptoms[Math.floor(Math.random() * this.symptoms.length)];
            const medication = this.medications[Math.floor(Math.random() * this.medications.length)];
            
            visits.push({
                date: visitDate.toISOString().split('T')[0],
                disease: disease,
                symptom: symptom,
                medication: medication,
                notes: `${disease} 진료, ${symptom} 증상으로 ${medication} 처방`
            });
        }
        
        return visits.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    /**
     * 금일 대기 환자 15명 생성
     */
    generateTodayWaitingPatients() {
        const waitingPatients = [];
        const currentTime = new Date();
        
        // 오늘 방문할 환자들 (기존 환자 중 일부)
        const todayVisitors = [
            { id: 1, name: '김민수', mrn: 'MRN20250001', visitType: '재진', symptoms: '두통, 어지러움' },
            { id: 2, name: '이영희', mrn: 'MRN20250002', visitType: '재진', symptoms: '복통, 소화불량' },
            { id: 3, name: '박철수', mrn: 'MRN20250003', visitType: '초진', symptoms: '감기, 기침' },
            { id: 4, name: '최정희', mrn: 'MRN20250004', visitType: '재진', symptoms: '고혈압, 두통' },
            { id: 5, name: '정민호', mrn: 'MRN20250005', visitType: '재진', symptoms: '당뇨, 피로감' },
            { id: 6, name: '강영수', mrn: 'MRN20250006', visitType: '초진', symptoms: '위염, 복통' },
            { id: 7, name: '조순희', mrn: 'MRN20250007', visitType: '재진', symptoms: '관절염, 요통' },
            { id: 8, name: '윤지훈', mrn: 'MRN20250008', visitType: '재진', symptoms: '천식, 호흡곤란' },
            { id: 9, name: '장민영', mrn: 'MRN20250009', visitType: '초진', symptoms: '알레르기, 발진' },
            { id: 10, name: '임현우', mrn: 'MRN20250010', visitType: '재진', symptoms: '불면증, 피로감' },
            { id: 11, name: '한성호', mrn: 'MRN20250011', visitType: '재진', symptoms: '우울증, 불안' },
            { id: 12, name: '오동현', mrn: 'MRN20250012', visitType: '초진', symptoms: '심장질환, 가슴통증' },
            { id: 13, name: '서지민', mrn: 'MRN20250013', visitType: '재진', symptoms: '간질환, 피로감' },
            { id: 14, name: '신민철', mrn: 'MRN20250014', visitType: '재진', symptoms: '신장질환, 부종' },
            { id: 15, name: '권영호', mrn: 'MRN20250015', visitType: '초진', symptoms: '갑상선질환, 체중감소' }
        ];
        
        todayVisitors.forEach((patient, index) => {
            const arrivalTime = new Date(currentTime);
            arrivalTime.setHours(9 + Math.floor(Math.random() * 8)); // 9시-17시
            arrivalTime.setMinutes(Math.floor(Math.random() * 60));
            
            waitingPatients.push({
                id: patient.id,
                mrn: patient.mrn,
                name: patient.name,
                visitType: patient.visitType,
                symptoms: patient.symptoms,
                arrivalTime: arrivalTime.toTimeString().slice(0, 5),
                estimatedWaitTime: Math.floor(Math.random() * 30) + 10, // 10-40분
                priority: Math.random() < 0.2 ? 'urgent' : 'normal', // 20% 확률로 긴급
                status: 'waiting' // waiting, in_progress, completed
            });
        });
        
        return waitingPatients.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
    }
    
    /**
     * 단일 환자 데이터 생성
     */
    generateSinglePatient(index) {
        const sex = this.generateRandomSex();
        const name = this.generateRandomName(sex);
        const birthDate = this.generateRandomBirthDate();
        const age = new Date().getFullYear() - birthDate.getFullYear();
        
        return {
            id: index,
            mrn: this.generateMRN(index),
            name: name,
            birthDate: birthDate.toISOString().split('T')[0],
            sex: sex,
            age: age,
            phone: this.generateRandomPhone(),
            email: this.generateRandomEmail(name),
            address: this.generateRandomAddress(),
            insuranceNo: this.generateRandomInsuranceNo(),
            allergies: this.generateRandomAllergies(),
            medicalHistory: this.generateRandomMedicalHistory(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 50명 환자 데이터 생성
     */
    generate50Patients() {
        const patients = [];
        
        console.log('환자 데이터 생성 중...');
        
        for (let i = 1; i <= 50; i++) {
            const patient = this.generateSinglePatient(i);
            patients.push(patient);
            
            if (i % 10 === 0) {
                console.log(`${i}명 생성 완료...`);
            }
        }
        
        console.log('50명 환자 데이터 생성 완료!');
        return patients;
    }
    
    /**
     * 데이터를 JSON 파일로 저장
     */
    saveToJson(patients, waitingPatients, filename = 'patient_data_50_with_waiting.json') {
        const data = {
            metadata: {
                generated_at: new Date().toISOString(),
                total_patients: patients.length,
                total_waiting_patients: waitingPatients.length,
                description: 'EMR 시스템용 환자 데이터 (50명) + 금일 대기 환자 (15명)'
            },
            patients: patients,
            waitingPatients: waitingPatients
        };
        
        const filePath = path.join(process.cwd(), filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log(`환자 데이터가 ${filename}에 저장되었습니다.`);
        return filePath;
    }
    
    /**
     * 통계 정보 생성
     */
    generateStatistics(patients, waitingPatients) {
        const stats = {
            totalPatients: patients.length,
            totalWaitingPatients: waitingPatients.length,
            bySex: {
                male: patients.filter(p => p.sex === 'M').length,
                female: patients.filter(p => p.sex === 'F').length
            },
            byAge: {
                '0-20': patients.filter(p => p.age <= 20).length,
                '21-40': patients.filter(p => p.age >= 21 && p.age <= 40).length,
                '41-60': patients.filter(p => p.age >= 41 && p.age <= 60).length,
                '61-80': patients.filter(p => p.age >= 61 && p.age <= 80).length,
                '81+': patients.filter(p => p.age >= 81).length
            },
            withAllergies: patients.filter(p => p.allergies.length > 0 && !p.allergies.includes('없음')).length,
            withMedicalHistory: patients.filter(p => p.medicalHistory.length > 0).length,
            averageVisits: patients.reduce((sum, p) => sum + p.medicalHistory.length, 0) / patients.length,
            waitingByType: {
                initial: waitingPatients.filter(p => p.visitType === '초진').length,
                revisit: waitingPatients.filter(p => p.visitType === '재진').length
            },
            waitingByPriority: {
                normal: waitingPatients.filter(p => p.priority === 'normal').length,
                urgent: waitingPatients.filter(p => p.priority === 'urgent').length
            }
        };
        
        console.log('\n=== 환자 데이터 통계 ===');
        console.log(`총 환자 수: ${stats.totalPatients}명`);
        console.log(`금일 대기 환자: ${stats.totalWaitingPatients}명`);
        console.log(`성별 분포: 남성 ${stats.bySex.male}명, 여성 ${stats.bySex.female}명`);
        console.log(`연령대 분포:`);
        console.log(`  - 0-20세: ${stats.byAge['0-20']}명`);
        console.log(`  - 21-40세: ${stats.byAge['21-40']}명`);
        console.log(`  - 41-60세: ${stats.byAge['41-60']}명`);
        console.log(`  - 61-80세: ${stats.byAge['61-80']}명`);
        console.log(`  - 81세 이상: ${stats.byAge['81+']}명`);
        console.log(`알레르기 보유: ${stats.withAllergies}명`);
        console.log(`진료 이력 보유: ${stats.withMedicalHistory}명`);
        console.log(`평균 방문 횟수: ${stats.averageVisits.toFixed(1)}회`);
        console.log(`\n=== 금일 대기 환자 통계 ===`);
        console.log(`초진: ${stats.waitingByType.initial}명`);
        console.log(`재진: ${stats.waitingByType.revisit}명`);
        console.log(`일반: ${stats.waitingByPriority.normal}명`);
        console.log(`긴급: ${stats.waitingByPriority.urgent}명`);
        
        return stats;
    }
    
    /**
     * 메인 실행 함수
     */
    run() {
        try {
            console.log('=== 환자 데이터 생성기 시작 (50명 + 대기환자 15명) ===');
            
            // 50명 환자 데이터 생성
            const patients = this.generate50Patients();
            
            // 금일 대기 환자 15명 생성
            const waitingPatients = this.generateTodayWaitingPatients();
            
            // 통계 정보 생성
            const stats = this.generateStatistics(patients, waitingPatients);
            
            // JSON 파일 저장
            const jsonPath = this.saveToJson(patients, waitingPatients);
            
            console.log('\n=== 생성 완료 ===');
            console.log(`JSON 파일: ${jsonPath}`);
            
            return {
                patients,
                waitingPatients,
                stats,
                jsonPath
            };
            
        } catch (error) {
            console.error('환자 데이터 생성 중 오류 발생:', error);
            throw error;
        }
    }
}

// 메인 실행
if (import.meta.url === `file://${process.argv[1]}`) {
    const generator = new PatientDataGenerator50();
    generator.run();
}

export default PatientDataGenerator50;
