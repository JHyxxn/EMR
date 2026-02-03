/**
 * 문서 관리 시스템
 * 
 * 담당자: 조형석 (백엔드) / 김지현 (AI Gateway)
 * 
 * 주요 기능:
 * - 소견서 자동 생성
 * - 진료 보고서 자동 생성 (SOAP 형식)
 * - 처방전 자동 생성
 * - 검사 요청서 자동 생성
 * - 문서 파일 저장 및 관리
 * - 문서 목록 조회
 * 
 * 기술 스택:
 * - Node.js
 * - 템플릿 기반 문서 생성
 * - 파일 시스템 (fs)
 * - 환자 정보 자동 매핑
 * 
 * 템플릿 종류:
 * - 소견서 (opinion)
 * - 진료 보고서 (medicalReport)
 * - 처방전 (prescription)
 * - 검사 요청서 (testRequest)
 * 
 * API 엔드포인트:
 * - /api/documents/opinion - 소견서 생성
 * - /api/documents/medical-report - 진료 보고서 생성
 * - /api/documents/prescription - 처방전 생성
 * - /api/documents/test-request - 검사 요청서 생성
 * - /api/documents - 문서 목록 조회
 */

import fs from 'fs';
import path from 'path';

class DocumentManagement {
    constructor() {
        this.templates = {
            // 소견서 템플릿
            opinion: {
                title: '의사 소견서',
                template: `
[의사 소견서]

환자명: {patientName}
생년월일: {birthDate}
성별: {sex}
MRN: {mrn}

소견 내용:
{opinionContent}

추천 사항:
{recommendations}

상급 종합병원 진료 권고:
{referralReason}

발급일: {issueDate}
담당의: {doctorName}
병원명: {hospitalName}
                `
            },
            
            // 진료 보고서 템플릿
            medicalReport: {
                title: '진료 보고서',
                template: `
[진료 보고서]

환자명: {patientName}
생년월일: {birthDate}
성별: {sex}
MRN: {mrn}
진료일: {visitDate}

주관적 증상 (S):
{subjectiveSymptoms}

객관적 소견 (O):
{objectiveFindings}

평가 및 진단 (A):
{assessment}

치료 계획 (P):
{treatmentPlan}

처방 약물:
{prescribedMedications}

추가 검사:
{additionalTests}

다음 방문일: {nextVisitDate}

담당의: {doctorName}
병원명: {hospitalName}
                `
            },
            
            // 처방전 템플릿
            prescription: {
                title: '처방전',
                template: `
[처방전]

환자명: {patientName}
생년월일: {birthDate}
성별: {sex}
MRN: {mrn}
처방일: {prescriptionDate}

처방 약물:
{prescribedMedications}

복용법:
{dosageInstructions}

주의사항:
{precautions}

알레르기 정보:
{allergies}

발급일: {issueDate}
처방의: {doctorName}
병원명: {hospitalName}
                `
            },
            
            // 검사 요청서 템플릿
            testRequest: {
                title: '검사 요청서',
                template: `
[검사 요청서]

환자명: {patientName}
생년월일: {birthDate}
성별: {sex}
MRN: {mrn}
요청일: {requestDate}

요청 검사:
{requestedTests}

검사 목적:
{testPurpose}

임상 소견:
{clinicalFindings}

긴급도: {urgency}

요청의: {doctorName}
병원명: {hospitalName}
                `
            }
        };
    }
    
    /**
     * 소견서 생성
     */
    generateOpinion(patientData, opinionData) {
        const template = this.templates.opinion.template;
        const currentDate = new Date().toLocaleDateString('ko-KR');
        
        const content = template
            .replace('{patientName}', patientData.name)
            .replace('{birthDate}', patientData.birthDate)
            .replace('{sex}', patientData.sex === 'M' ? '남성' : '여성')
            .replace('{mrn}', patientData.mrn)
            .replace('{opinionContent}', opinionData.content)
            .replace('{recommendations}', opinionData.recommendations)
            .replace('{referralReason}', opinionData.referralReason)
            .replace('{issueDate}', currentDate)
            .replace('{doctorName}', '김의사')
            .replace('{hospitalName}', 'EMR 병원');
        
        return {
            title: this.templates.opinion.title,
            content: content,
            patientData: patientData,
            opinionData: opinionData,
            generatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 진료 보고서 생성
     */
    generateMedicalReport(patientData, visitData) {
        const template = this.templates.medicalReport.template;
        const currentDate = new Date().toLocaleDateString('ko-KR');
        
        const content = template
            .replace('{patientName}', patientData.name)
            .replace('{birthDate}', patientData.birthDate)
            .replace('{sex}', patientData.sex === 'M' ? '남성' : '여성')
            .replace('{mrn}', patientData.mrn)
            .replace('{visitDate}', currentDate)
            .replace('{subjectiveSymptoms}', visitData.subjective)
            .replace('{objectiveFindings}', visitData.objective)
            .replace('{assessment}', visitData.assessment)
            .replace('{treatmentPlan}', visitData.treatmentPlan)
            .replace('{prescribedMedications}', visitData.medications)
            .replace('{additionalTests}', visitData.tests)
            .replace('{nextVisitDate}', visitData.nextVisit)
            .replace('{doctorName}', '김의사')
            .replace('{hospitalName}', 'EMR 병원');
        
        return {
            title: this.templates.medicalReport.title,
            content: content,
            patientData: patientData,
            visitData: visitData,
            generatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 처방전 생성
     */
    generatePrescription(patientData, prescriptionData) {
        const template = this.templates.prescription.template;
        const currentDate = new Date().toLocaleDateString('ko-KR');
        
        const content = template
            .replace('{patientName}', patientData.name)
            .replace('{birthDate}', patientData.birthDate)
            .replace('{sex}', patientData.sex === 'M' ? '남성' : '여성')
            .replace('{mrn}', patientData.mrn)
            .replace('{prescriptionDate}', currentDate)
            .replace('{prescribedMedications}', prescriptionData.medications)
            .replace('{dosageInstructions}', prescriptionData.dosage)
            .replace('{precautions}', prescriptionData.precautions)
            .replace('{allergies}', patientData.allergies.join(', ') || '없음')
            .replace('{issueDate}', currentDate)
            .replace('{doctorName}', '김의사')
            .replace('{hospitalName}', 'EMR 병원');
        
        return {
            title: this.templates.prescription.title,
            content: content,
            patientData: patientData,
            prescriptionData: prescriptionData,
            generatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 검사 요청서 생성
     */
    generateTestRequest(patientData, testData) {
        const template = this.templates.testRequest.template;
        const currentDate = new Date().toLocaleDateString('ko-KR');
        
        const content = template
            .replace('{patientName}', patientData.name)
            .replace('{birthDate}', patientData.birthDate)
            .replace('{sex}', patientData.sex === 'M' ? '남성' : '여성')
            .replace('{mrn}', patientData.mrn)
            .replace('{requestDate}', currentDate)
            .replace('{requestedTests}', testData.tests)
            .replace('{testPurpose}', testData.purpose)
            .replace('{clinicalFindings}', testData.findings)
            .replace('{urgency}', testData.urgency)
            .replace('{doctorName}', '김의사')
            .replace('{hospitalName}', 'EMR 병원');
        
        return {
            title: this.templates.testRequest.title,
            content: content,
            patientData: patientData,
            testData: testData,
            generatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 문서를 파일로 저장
     */
    saveDocument(document, filename) {
        const filePath = path.join(process.cwd(), 'documents', filename);
        
        // documents 디렉토리가 없으면 생성
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, document.content, 'utf8');
        console.log(`문서가 저장되었습니다: ${filePath}`);
        
        return filePath;
    }
    
    /**
     * 문서 목록 조회
     */
    getDocumentList() {
        const documentsDir = path.join(process.cwd(), 'documents');
        
        if (!fs.existsSync(documentsDir)) {
            return [];
        }
        
        const files = fs.readdirSync(documentsDir);
        return files.map(file => {
            const filePath = path.join(documentsDir, file);
            const stats = fs.statSync(filePath);
            
            return {
                filename: file,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            };
        });
    }
    
    /**
     * 문서 삭제
     */
    deleteDocument(filename) {
        const filePath = path.join(process.cwd(), 'documents', filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`문서가 삭제되었습니다: ${filename}`);
            return true;
        }
        
        return false;
    }
}

export default DocumentManagement;
