/**
 * 처방 관리 시스템
 * 
 * 담당자: 조형석 (백엔드)
 * 
 * 주요 기능:
 * - 처방전 생성 및 저장
 * - 약물 상호작용 검사
 * - 처방 이력 조회
 * - 처방 통계 생성
 * - 약물 정보 관리
 * 
 * 기술 스택:
 * - Node.js
 * - 파일 시스템 (fs)
 * - 약물 데이터베이스 연동
 * 
 * 약물 정보:
 * - 약물명, 카테고리, 용량, 복용법
 * - 약물 상호작용 목록
 * - 금기사항
 * - 부작용 정보
 * 
 * API 엔드포인트:
 * - /api/prescriptions - 처방전 생성
 * - /api/prescriptions/check-interactions - 약물 상호작용 검사
 * - /api/prescriptions/history/:patientId - 처방 이력 조회
 * - /api/prescriptions/statistics - 처방 통계 조회
 */

import fs from 'fs';
import path from 'path';

class PrescriptionManagement {
    constructor() {
        // 약물 데이터베이스 (간단한 예시)
        this.medications = {
            '아몰디핀정': {
                name: '아몰디핀정',
                category: '고혈압약',
                dosage: '5mg',
                frequency: '1일 1회',
                duration: '30일',
                interactions: ['그레이프프루트', '디곡신'],
                contraindications: ['임신', '수유'],
                sideEffects: ['부종', '어지러움', '두통']
            },
            '로사르탄정': {
                name: '로사르탄정',
                category: '고혈압약',
                dosage: '50mg',
                frequency: '1일 1회',
                duration: '30일',
                interactions: ['칼륨보충제', '리튬'],
                contraindications: ['임신', '양측신동맥협착'],
                sideEffects: ['기침', '어지러움', '두통']
            },
            '다이아벡스정': {
                name: '다이아벡스정',
                category: '당뇨약',
                dosage: '500mg',
                frequency: '1일 2회',
                duration: '30일',
                interactions: ['와파린', '설폰아미드'],
                contraindications: ['신부전', '간부전'],
                sideEffects: ['저혈당', '위장장애', '발진']
            },
            '메토프롤롤정': {
                name: '메토프롤롤정',
                category: '베타차단제',
                dosage: '50mg',
                frequency: '1일 2회',
                duration: '30일',
                interactions: ['디곡신', '베라파밀'],
                contraindications: ['기관지천식', '서맥'],
                sideEffects: ['서맥', '저혈압', '피로감']
            }
        };
        
        // 처방 템플릿
        this.prescriptionTemplate = {
            header: `
[처방전]

환자명: {patientName}
생년월일: {birthDate}
성별: {sex}
MRN: {mrn}
처방일: {prescriptionDate}
처방의: {doctorName}
병원명: {hospitalName}
            `,
            medication: `
약물명: {medicationName}
성분: {ingredient}
용량: {dosage}
복용법: {frequency}
기간: {duration}
총량: {totalAmount}
            `,
            footer: `
주의사항: {precautions}
알레르기 정보: {allergies}
상호작용: {interactions}

발급일: {issueDate}
처방의: {doctorName}
병원명: {hospitalName}
            `
        };
    }
    
    /**
     * 처방전 생성
     */
    createPrescription(patientData, prescriptionData) {
        const prescription = {
            id: this.generatePrescriptionId(),
            patientId: patientData.id,
            patientName: patientData.name,
            mrn: patientData.mrn,
            prescriptionDate: new Date().toISOString(),
            doctor: prescriptionData.doctor || '김의사',
            medications: prescriptionData.medications,
            totalAmount: this.calculateTotalAmount(prescriptionData.medications),
            status: 'active',
            notes: prescriptionData.notes || '',
            interactions: this.checkInteractions(prescriptionData.medications),
            contraindications: this.checkContraindications(patientData, prescriptionData.medications)
        };
        
        return prescription;
    }
    
    /**
     * 약물 상호작용 검사
     */
    checkInteractions(medications) {
        const interactions = [];
        
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const med1 = medications[i];
                const med2 = medications[j];
                
                const interaction = this.findInteraction(med1.name, med2.name);
                if (interaction) {
                    interactions.push({
                        medication1: med1.name,
                        medication2: med2.name,
                        interaction: interaction,
                        severity: this.getInteractionSeverity(interaction)
                    });
                }
            }
        }
        
        return interactions;
    }
    
    /**
     * 금기사항 검사
     */
    checkContraindications(patientData, medications) {
        const contraindications = [];
        
        medications.forEach(medication => {
            const medInfo = this.medications[medication.name];
            if (medInfo && medInfo.contraindications) {
                medInfo.contraindications.forEach(contraindication => {
                    if (this.isPatientContraindicated(patientData, contraindication)) {
                        contraindications.push({
                            medication: medication.name,
                            contraindication: contraindication,
                            severity: 'high'
                        });
                    }
                });
            }
        });
        
        return contraindications;
    }
    
    /**
     * 상호작용 찾기
     */
    findInteraction(med1, med2) {
        const interactions = {
            '아몰디핀정-그레이프프루트': '그레이프프루트가 아몰디핀의 혈중 농도를 증가시킬 수 있습니다.',
            '로사르탄정-칼륨보충제': '칼륨보충제와 함께 복용 시 고칼륨혈증 위험이 있습니다.',
            '다이아벡스정-와파린': '와파린의 항응고 효과가 증가할 수 있습니다.',
            '메토프롤롤정-디곡신': '디곡신의 혈중 농도가 증가할 수 있습니다.'
        };
        
        const key1 = `${med1}-${med2}`;
        const key2 = `${med2}-${med1}`;
        
        return interactions[key1] || interactions[key2] || null;
    }
    
    /**
     * 상호작용 심각도 평가
     */
    getInteractionSeverity(interaction) {
        const highSeverityKeywords = ['위험', '금기', '고칼륨혈증', '항응고'];
        const mediumSeverityKeywords = ['증가', '감소', '변화'];
        
        for (const keyword of highSeverityKeywords) {
            if (interaction.includes(keyword)) {
                return 'high';
            }
        }
        
        for (const keyword of mediumSeverityKeywords) {
            if (interaction.includes(keyword)) {
                return 'medium';
            }
        }
        
        return 'low';
    }
    
    /**
     * 환자 금기사항 확인
     */
    isPatientContraindicated(patientData, contraindication) {
        // 실제 구현에서는 환자 데이터와 금기사항을 비교
        return false;
    }
    
    /**
     * 총 처방량 계산
     */
    calculateTotalAmount(medications) {
        let total = 0;
        
        medications.forEach(medication => {
            const amount = medication.amount || 0;
            total += amount;
        });
        
        return total;
    }
    
    /**
     * 처방전 ID 생성
     */
    generatePrescriptionId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `RX${timestamp}${random}`;
    }
    
    /**
     * 처방전 텍스트 생성
     */
    generatePrescriptionText(prescription) {
        const template = this.prescriptionTemplate;
        const currentDate = new Date().toLocaleDateString('ko-KR');
        
        let prescriptionText = template.header
            .replace('{patientName}', prescription.patientName)
            .replace('{birthDate}', prescription.patientData?.birthDate || '')
            .replace('{sex}', prescription.patientData?.sex === 'M' ? '남성' : '여성')
            .replace('{mrn}', prescription.mrn)
            .replace('{prescriptionDate}', currentDate)
            .replace('{doctorName}', prescription.doctor)
            .replace('{hospitalName}', 'EMR 병원');
        
        // 약물 정보 추가
        prescription.medications.forEach(medication => {
            const medInfo = this.medications[medication.name];
            if (medInfo) {
                prescriptionText += template.medication
                    .replace('{medicationName}', medication.name)
                    .replace('{ingredient}', medInfo.ingredient || '')
                    .replace('{dosage}', medInfo.dosage)
                    .replace('{frequency}', medInfo.frequency)
                    .replace('{duration}', medInfo.duration)
                    .replace('{totalAmount}', medication.amount || '');
            }
        });
        
        // 주의사항 및 알레르기 정보 추가
        prescriptionText += template.footer
            .replace('{precautions}', this.generatePrecautions(prescription))
            .replace('{allergies}', prescription.patientData?.allergies?.join(', ') || '없음')
            .replace('{interactions}', this.formatInteractions(prescription.interactions))
            .replace('{issueDate}', currentDate)
            .replace('{doctorName}', prescription.doctor)
            .replace('{hospitalName}', 'EMR 병원');
        
        return prescriptionText;
    }
    
    /**
     * 주의사항 생성
     */
    generatePrecautions(prescription) {
        const precautions = [];
        
        // 상호작용 주의사항
        if (prescription.interactions.length > 0) {
            precautions.push('약물 상호작용 주의');
        }
        
        // 금기사항 주의사항
        if (prescription.contraindications.length > 0) {
            precautions.push('금기사항 확인 필요');
        }
        
        // 일반 주의사항
        precautions.push('의사 처방 없이 복용 중단 금지');
        precautions.push('부작용 발생 시 즉시 의사 상담');
        
        return precautions.join(', ');
    }
    
    /**
     * 상호작용 포맷팅
     */
    formatInteractions(interactions) {
        if (interactions.length === 0) {
            return '없음';
        }
        
        return interactions.map(interaction => 
            `${interaction.medication1} + ${interaction.medication2}: ${interaction.interaction}`
        ).join('; ');
    }
    
    /**
     * 처방 이력 조회
     */
    getPrescriptionHistory(patientId) {
        // 실제 구현에서는 데이터베이스에서 조회
        return [];
    }
    
    /**
     * 처방 통계 생성
     */
    generatePrescriptionStatistics() {
        return {
            totalPrescriptions: 0,
            activePrescriptions: 0,
            completedPrescriptions: 0,
            byCategory: {},
            byDoctor: {},
            interactionAlerts: 0,
            contraindicationAlerts: 0
        };
    }
    
    /**
     * 처방전 저장
     */
    savePrescription(prescription) {
        const filename = `prescription_${prescription.id}.txt`;
        const filePath = path.join(process.cwd(), 'prescriptions', filename);
        
        // prescriptions 디렉토리가 없으면 생성
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const prescriptionText = this.generatePrescriptionText(prescription);
        fs.writeFileSync(filePath, prescriptionText, 'utf8');
        
        console.log(`처방전이 저장되었습니다: ${filePath}`);
        return filePath;
    }
}

export default PrescriptionManagement;
