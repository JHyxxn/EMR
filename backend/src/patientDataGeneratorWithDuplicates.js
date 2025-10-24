/**
 * 환자 데이터 생성기 (동명이인 포함)
 * 실제 병원에서 발생하는 동명이인, 동명이인+생년월일 동일 케이스를 포함한 환자 100명 데이터 생성
 */

import fs from 'fs';
import path from 'path';

class PatientDataGeneratorWithDuplicates {
    constructor() {
        // 한국 성씨 (상위 20개)
        this.lastNames = [
            '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
            '한', '오', '서', '신', '권', '황', '안', '송', '전', '고'
        ];
        
        // 한국 이름 (남성) - 동명이인을 위해 인기 있는 이름 추가
        this.maleNames = [
            '민수', '영수', '철수', '준호', '성호', '동호', '현우', '지훈', '민호', '준영',
            '성민', '동현', '현수', '지호', '민철', '영호', '철호', '준수', '성수', '동수',
            '현민', '지민', '민현', '영민', '철민', '준민', '성현', '동민', '현철', '지철',
            // 동명이인을 위한 인기 이름들
            '민수', '영수', '철수', '준호', '성호', '동호', '현우', '지훈', '민호', '준영'
        ];
        
        // 한국 이름 (여성) - 동명이인을 위해 인기 있는 이름 추가
        this.femaleNames = [
            '영희', '민희', '순희', '정희', '영숙', '민숙', '순숙', '정숙', '영자', '민자',
            '순자', '정자', '영미', '민미', '순미', '정미', '영주', '민주', '순주', '정주',
            '영수', '민수', '순수', '정수', '영경', '민경', '순경', '정경', '영애', '민애',
            // 동명이인을 위한 인기 이름들
            '영희', '민희', '순희', '정희', '영숙', '민숙', '순숙', '정숙', '영자', '민자'
        ];
        
        // 질병 목록
        this.diseases = [
            '고혈압', '당뇨병', '감기', '위염', '두통', '요통', '관절염', '천식', '알레르기', '불면증',
            '우울증', '불안장애', '심장질환', '간질환', '신장질환', '갑상선질환', '류마티스', '골다공증', '치매', '파킨슨병'
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
            '아세트아미노펜', '이부프로펜', '아스피린', '오메프라졸', '란소프라졸',
            '로라타딘', '세티리진', '프레드니솔론', '하이드로코르티손', '디곡신'
        ];
        
        // 동명이인 케이스 저장
        this.duplicateCases = [];
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
     * 특정 생년월일 생성 (동명이인 + 생년월일 동일 케이스용)
     */
    generateSpecificBirthDate(year, month, day) {
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
        const numVisits = Math.floor(Math.random() * 5) + 1;
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
     * 동명이인 케이스 생성
     */
    generateDuplicateCases() {
        const duplicateCases = [];
        
        // 케이스 1: 김민수 (남성, 1980년생) - 2명
        const kimMinsu1 = {
            id: 1,
            mrn: this.generateMRN(1),
            name: '김민수',
            birthDate: '1980-05-15',
            sex: 'M',
            age: 44,
            phone: '010-1234-5678',
            email: 'kimminsu1@gmail.com',
            address: '서울특별시 강남구 테헤란로 123번길 45호',
            insuranceNo: '1234567890',
            allergies: ['페니실린'],
            medicalHistory: this.generateRandomMedicalHistory(),
            duplicateType: '동명이인',
            duplicateNote: '김민수 (1980년생) - 1번째',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const kimMinsu2 = {
            id: 2,
            mrn: this.generateMRN(2),
            name: '김민수',
            birthDate: '1980-05-15',
            sex: 'M',
            age: 44,
            phone: '010-9876-5432',
            email: 'kimminsu2@naver.com',
            address: '부산광역시 해운대구 해운대로 456번길 78호',
            insuranceNo: '0987654321',
            allergies: ['아스피린'],
            medicalHistory: this.generateRandomMedicalHistory(),
            duplicateType: '동명이인+생년월일동일',
            duplicateNote: '김민수 (1980년생) - 2번째 - 생년월일 동일',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // 케이스 2: 이영희 (여성, 1975년생) - 2명
        const leeYounghee1 = {
            id: 3,
            mrn: this.generateMRN(3),
            name: '이영희',
            birthDate: '1975-03-20',
            sex: 'F',
            age: 49,
            phone: '010-1111-2222',
            email: 'leeyounghee1@daum.net',
            address: '대구광역시 중구 중앙대로 789번길 12호',
            insuranceNo: '1111111111',
            allergies: [],
            medicalHistory: this.generateRandomMedicalHistory(),
            duplicateType: '동명이인',
            duplicateNote: '이영희 (1975년생) - 1번째',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const leeYounghee2 = {
            id: 4,
            mrn: this.generateMRN(4),
            name: '이영희',
            birthDate: '1975-03-20',
            sex: 'F',
            age: 49,
            phone: '010-3333-4444',
            email: 'leeyounghee2@hanmail.net',
            address: '인천광역시 연수구 컨벤시아대로 345번길 67호',
            insuranceNo: '2222222222',
            allergies: ['설폰아미드'],
            medicalHistory: this.generateRandomMedicalHistory(),
            duplicateType: '동명이인+생년월일동일',
            duplicateNote: '이영희 (1975년생) - 2번째 - 생년월일 동일',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // 케이스 3: 박철수 (남성, 1990년생) - 2명
        const parkCheolsu1 = {
            id: 5,
            mrn: this.generateMRN(5),
            name: '박철수',
            birthDate: '1990-08-10',
            sex: 'M',
            age: 34,
            phone: '010-5555-6666',
            email: 'parkcheolsu1@yahoo.com',
            address: '광주광역시 서구 상무대로 901번길 23호',
            insuranceNo: '3333333333',
            allergies: ['세파클로르'],
            medicalHistory: this.generateRandomMedicalHistory(),
            duplicateType: '동명이인',
            duplicateNote: '박철수 (1990년생) - 1번째',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const parkCheolsu2 = {
            id: 6,
            mrn: this.generateMRN(6),
            name: '박철수',
            birthDate: '1990-08-10',
            sex: 'M',
            age: 34,
            phone: '010-7777-8888',
            email: 'parkcheolsu2@gmail.com',
            address: '대전광역시 유성구 대학로 234번길 56호',
            insuranceNo: '4444444444',
            allergies: [],
            medicalHistory: this.generateRandomMedicalHistory(),
            duplicateType: '동명이인+생년월일동일',
            duplicateNote: '박철수 (1990년생) - 2번째 - 생년월일 동일',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        duplicateCases.push(kimMinsu1, kimMinsu2, leeYounghee1, leeYounghee2, parkCheolsu1, parkCheolsu2);
        
        return duplicateCases;
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
            duplicateType: '일반',
            duplicateNote: '일반 환자',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 100명 환자 데이터 생성 (동명이인 포함)
     */
    generate100PatientsWithDuplicates() {
        const patients = [];
        
        console.log('동명이인 케이스 생성 중...');
        
        // 동명이인 케이스 6명 먼저 생성
        const duplicateCases = this.generateDuplicateCases();
        patients.push(...duplicateCases);
        
        console.log('일반 환자 데이터 생성 중...');
        
        // 나머지 94명 일반 환자 생성
        for (let i = 7; i <= 100; i++) {
            const patient = this.generateSinglePatient(i);
            patients.push(patient);
            
            if (i % 10 === 0) {
                console.log(`${i}명 생성 완료...`);
            }
        }
        
        console.log('100명 환자 데이터 생성 완료!');
        return patients;
    }
    
    /**
     * 데이터를 JSON 파일로 저장
     */
    saveToJson(patients, filename = 'patient_data_100_with_duplicates.json') {
        const data = {
            metadata: {
                generated_at: new Date().toISOString(),
                total_patients: patients.length,
                description: 'EMR 시스템용 환자 데이터 (100명) - 동명이인 케이스 포함',
                duplicate_cases: {
                    total_duplicates: patients.filter(p => p.duplicateType !== '일반').length,
                    name_only_duplicates: patients.filter(p => p.duplicateType === '동명이인').length,
                    name_birthdate_duplicates: patients.filter(p => p.duplicateType === '동명이인+생년월일동일').length
                }
            },
            patients: patients
        };
        
        const filePath = path.join(process.cwd(), filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log(`환자 데이터가 ${filename}에 저장되었습니다.`);
        return filePath;
    }
    
    /**
     * 통계 정보 생성
     */
    generateStatistics(patients) {
        const stats = {
            total: patients.length,
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
            duplicateCases: {
                total: patients.filter(p => p.duplicateType !== '일반').length,
                nameOnly: patients.filter(p => p.duplicateType === '동명이인').length,
                nameBirthdate: patients.filter(p => p.duplicateType === '동명이인+생년월일동일').length
            }
        };
        
        console.log('\n=== 환자 데이터 통계 ===');
        console.log(`총 환자 수: ${stats.total}명`);
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
        console.log(`\n=== 동명이인 케이스 ===`);
        console.log(`총 동명이인: ${stats.duplicateCases.total}명`);
        console.log(`동명이인만: ${stats.duplicateCases.nameOnly}명`);
        console.log(`동명이인+생년월일동일: ${stats.duplicateCases.nameBirthdate}명`);
        
        return stats;
    }
    
    /**
     * 동명이인 케이스 상세 정보 출력
     */
    printDuplicateCases(patients) {
        console.log('\n=== 동명이인 케이스 상세 ===');
        
        const duplicates = patients.filter(p => p.duplicateType !== '일반');
        
        duplicates.forEach(patient => {
            console.log(`\n${patient.duplicateNote}:`);
            console.log(`  - MRN: ${patient.mrn}`);
            console.log(`  - 이름: ${patient.name}`);
            console.log(`  - 생년월일: ${patient.birthDate}`);
            console.log(`  - 성별: ${patient.sex === 'M' ? '남성' : '여성'}`);
            console.log(`  - 연락처: ${patient.phone}`);
            console.log(`  - 주소: ${patient.address}`);
            console.log(`  - 알레르기: ${patient.allergies.join(', ') || '없음'}`);
        });
    }
    
    /**
     * 메인 실행 함수
     */
    run() {
        try {
            console.log('=== 환자 데이터 생성기 시작 (동명이인 포함) ===');
            
            // 100명 환자 데이터 생성 (동명이인 포함)
            const patients = this.generate100PatientsWithDuplicates();
            
            // 통계 정보 생성
            const stats = this.generateStatistics(patients);
            
            // 동명이인 케이스 상세 정보 출력
            this.printDuplicateCases(patients);
            
            // JSON 파일 저장
            const jsonPath = this.saveToJson(patients);
            
            console.log('\n=== 생성 완료 ===');
            console.log(`JSON 파일: ${jsonPath}`);
            
            return {
                patients,
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
    const generator = new PatientDataGeneratorWithDuplicates();
    generator.run();
}

export default PatientDataGeneratorWithDuplicates;

