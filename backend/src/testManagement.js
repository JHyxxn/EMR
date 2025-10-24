/**
 * 검사 관리 시스템
 * 검사 요청, 결과 관리, 검사 일정 관리
 */

import fs from 'fs';
import path from 'path';

class TestManagement {
    constructor() {
        // 검사 종류 및 정상 범위
        this.testTypes = {
            // 혈액 검사
            blood: {
                'CBC': { name: '완전혈구계산', normalRange: '정상', unit: '' },
                'WBC': { name: '백혈구수', normalRange: '4,000-10,000', unit: '/μL' },
                'RBC': { name: '적혈구수', normalRange: '4.0-5.5', unit: '×10⁶/μL' },
                'HGB': { name: '혈색소', normalRange: '12-16', unit: 'g/dL' },
                'HCT': { name: '적혈구용적률', normalRange: '36-46', unit: '%' },
                'PLT': { name: '혈소판수', normalRange: '150,000-450,000', unit: '/μL' },
                'ESR': { name: '적혈구침강속도', normalRange: '0-20', unit: 'mm/hr' },
                'CRP': { name: 'C-반응성단백', normalRange: '0-3', unit: 'mg/L' }
            },
            
            // 생화학 검사
            chemistry: {
                'GLU': { name: '혈당', normalRange: '70-110', unit: 'mg/dL' },
                'BUN': { name: '요소질소', normalRange: '7-20', unit: 'mg/dL' },
                'CRE': { name: '크레아티닌', normalRange: '0.6-1.2', unit: 'mg/dL' },
                'ALT': { name: '알라닌아미노전이효소', normalRange: '0-40', unit: 'U/L' },
                'AST': { name: '아스파르테이트아미노전이효소', normalRange: '0-40', unit: 'U/L' },
                'ALP': { name: '알칼리인산분해효소', normalRange: '30-120', unit: 'U/L' },
                'T-BIL': { name: '총빌리루빈', normalRange: '0.2-1.2', unit: 'mg/dL' },
                'TP': { name: '총단백', normalRange: '6.0-8.0', unit: 'g/dL' },
                'ALB': { name: '알부민', normalRange: '3.5-5.0', unit: 'g/dL' },
                'CHOL': { name: '총콜레스테롤', normalRange: '0-200', unit: 'mg/dL' },
                'TG': { name: '중성지방', normalRange: '0-150', unit: 'mg/dL' },
                'HDL': { name: 'HDL콜레스테롤', normalRange: '40-60', unit: 'mg/dL' },
                'LDL': { name: 'LDL콜레스테롤', normalRange: '0-100', unit: 'mg/dL' }
            },
            
            // 심장 검사
            cardiac: {
                'CK': { name: '크레아틴키나제', normalRange: '20-200', unit: 'U/L' },
                'CK-MB': { name: 'CK-MB', normalRange: '0-25', unit: 'U/L' },
                'TROPONIN': { name: '트로포닌', normalRange: '0-0.04', unit: 'ng/mL' },
                'BNP': { name: '뇌나트륨이뇨펩티드', normalRange: '0-100', unit: 'pg/mL' }
            },
            
            // 갑상선 검사
            thyroid: {
                'TSH': { name: '갑상선자극호르몬', normalRange: '0.4-4.0', unit: 'mIU/L' },
                'T3': { name: '삼요오드티로닌', normalRange: '80-200', unit: 'ng/dL' },
                'T4': { name: '티록신', normalRange: '4.5-12.5', unit: 'μg/dL' },
                'FT3': { name: '유리T3', normalRange: '2.3-4.2', unit: 'pg/mL' },
                'FT4': { name: '유리T4', normalRange: '0.8-1.8', unit: 'ng/dL' }
            },
            
            // 종양표지자
            tumor: {
                'AFP': { name: '알파태아단백', normalRange: '0-20', unit: 'ng/mL' },
                'CEA': { name: '암배아성항원', normalRange: '0-5', unit: 'ng/mL' },
                'CA19-9': { name: 'CA19-9', normalRange: '0-37', unit: 'U/mL' },
                'CA125': { name: 'CA125', normalRange: '0-35', unit: 'U/mL' },
                'PSA': { name: '전립선특이항원', normalRange: '0-4', unit: 'ng/mL' }
            }
        };
        
        // 검사 일정 템플릿
        this.scheduleTemplate = {
            '혈액검사': { duration: 30, preparation: '12시간 금식' },
            '소변검사': { duration: 15, preparation: '중간뇨 채취' },
            '심전도': { duration: 20, preparation: '특별한 준비 없음' },
            '흉부X-ray': { duration: 25, preparation: '특별한 준비 없음' },
            '복부초음파': { duration: 40, preparation: '8시간 금식' },
            'CT': { duration: 60, preparation: '조영제 주사 전 금식' },
            'MRI': { duration: 90, preparation: '금속물질 제거' }
        };
    }
    
    /**
     * 검사 요청 생성
     */
    createTestRequest(patientData, testData) {
        const request = {
            id: this.generateTestId(),
            patientId: patientData.id,
            patientName: patientData.name,
            mrn: patientData.mrn,
            testType: testData.testType,
            testName: testData.testName,
            purpose: testData.purpose,
            urgency: testData.urgency || 'normal',
            requestedBy: testData.doctor || '김의사',
            requestedAt: new Date().toISOString(),
            status: 'requested',
            scheduledAt: testData.scheduledAt || null,
            completedAt: null,
            results: null,
            notes: testData.notes || ''
        };
        
        return request;
    }
    
    /**
     * 검사 일정 생성
     */
    scheduleTest(testRequest, availableSlots) {
        const testType = testRequest.testType;
        const template = this.scheduleTemplate[testType];
        
        if (!template) {
            throw new Error(`알 수 없는 검사 유형: ${testType}`);
        }
        
        const schedule = {
            testRequestId: testRequest.id,
            patientId: testRequest.patientId,
            patientName: testRequest.patientName,
            testType: testType,
            testName: testRequest.testName,
            scheduledAt: availableSlots[0],
            duration: template.duration,
            preparation: template.preparation,
            status: 'scheduled',
            assignedTechnician: this.assignTechnician(testType),
            room: this.assignRoom(testType)
        };
        
        return schedule;
    }
    
    /**
     * 검사 결과 입력
     */
    inputTestResults(testRequestId, results) {
        const testRequest = this.getTestRequest(testRequestId);
        
        if (!testRequest) {
            throw new Error('검사 요청을 찾을 수 없습니다.');
        }
        
        const testResults = {
            testRequestId: testRequestId,
            patientId: testRequest.patientId,
            testType: testRequest.testType,
            testName: testRequest.testName,
            results: results,
            completedAt: new Date().toISOString(),
            completedBy: '검사기사',
            status: 'completed',
            interpretation: this.interpretResults(testRequest.testType, results),
            recommendations: this.generateRecommendations(testRequest.testType, results)
        };
        
        return testResults;
    }
    
    /**
     * 검사 결과 해석
     */
    interpretResults(testType, results) {
        const interpretations = [];
        
        for (const [testCode, value] of Object.entries(results)) {
            const testInfo = this.getTestInfo(testType, testCode);
            
            if (testInfo) {
                const isNormal = this.isNormalValue(value, testInfo.normalRange);
                const interpretation = isNormal ? '정상' : '이상';
                
                interpretations.push({
                    testCode: testCode,
                    testName: testInfo.name,
                    value: value,
                    normalRange: testInfo.normalRange,
                    unit: testInfo.unit,
                    interpretation: interpretation,
                    isNormal: isNormal
                });
            }
        }
        
        return interpretations;
    }
    
    /**
     * 검사 결과 기반 권고사항 생성
     */
    generateRecommendations(testType, results) {
        const recommendations = [];
        
        // 비정상 결과에 대한 권고사항
        for (const [testCode, value] of Object.entries(results)) {
            const testInfo = this.getTestInfo(testType, testCode);
            
            if (testInfo && !this.isNormalValue(value, testInfo.normalRange)) {
                const recommendation = this.getRecommendation(testCode, value);
                if (recommendation) {
                    recommendations.push(recommendation);
                }
            }
        }
        
        return recommendations;
    }
    
    /**
     * 검사 정보 조회
     */
    getTestInfo(testType, testCode) {
        const category = this.testTypes[testType];
        return category ? category[testCode] : null;
    }
    
    /**
     * 정상 범위 확인
     */
    isNormalValue(value, normalRange) {
        if (normalRange === '정상') return true;
        
        const range = normalRange.split('-');
        if (range.length === 2) {
            const min = parseFloat(range[0].replace(/,/g, ''));
            const max = parseFloat(range[1].replace(/,/g, ''));
            return value >= min && value <= max;
        }
        
        return true;
    }
    
    /**
     * 권고사항 생성
     */
    getRecommendation(testCode, value) {
        const recommendations = {
            'GLU': '당뇨병 검사 및 내분비과 상담 권고',
            'CHOL': '지질 관리 및 식이 조절 권고',
            'TG': '중성지방 관리 및 운동 권고',
            'ALT': '간 기능 검사 및 간담도과 상담 권고',
            'AST': '간 기능 검사 및 간담도과 상담 권고',
            'CRE': '신장 기능 검사 및 신장내과 상담 권고',
            'TSH': '갑상선 기능 검사 및 내분비과 상담 권고'
        };
        
        return recommendations[testCode] || null;
    }
    
    /**
     * 검사기사 배정
     */
    assignTechnician(testType) {
        const technicians = {
            '혈액검사': '김검사기사',
            '소변검사': '이검사기사',
            '심전도': '박검사기사',
            '흉부X-ray': '최검사기사',
            '복부초음파': '정검사기사',
            'CT': '강검사기사',
            'MRI': '조검사기사'
        };
        
        return technicians[testType] || '김검사기사';
    }
    
    /**
     * 검사실 배정
     */
    assignRoom(testType) {
        const rooms = {
            '혈액검사': '검사실 1',
            '소변검사': '검사실 2',
            '심전도': '검사실 3',
            '흉부X-ray': '방사선실 1',
            '복부초음파': '초음파실 1',
            'CT': 'CT실 1',
            'MRI': 'MRI실 1'
        };
        
        return rooms[testType] || '검사실 1';
    }
    
    /**
     * 검사 ID 생성
     */
    generateTestId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `TEST${timestamp}${random}`;
    }
    
    /**
     * 검사 요청 조회
     */
    getTestRequest(testRequestId) {
        // 실제 구현에서는 데이터베이스에서 조회
        return null;
    }
    
    /**
     * 검사 일정 조회
     */
    getTestSchedule(date) {
        // 실제 구현에서는 데이터베이스에서 조회
        return [];
    }
    
    /**
     * 검사 결과 조회
     */
    getTestResults(patientId) {
        // 실제 구현에서는 데이터베이스에서 조회
        return [];
    }
    
    /**
     * 검사 통계 생성
     */
    generateTestStatistics() {
        return {
            totalRequests: 0,
            completedTests: 0,
            pendingTests: 0,
            byType: {},
            byUrgency: {
                normal: 0,
                urgent: 0,
                emergency: 0
            }
        };
    }
}

export default TestManagement;
