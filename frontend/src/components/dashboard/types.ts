/**
 * 대시보드에서 사용하는 통합 환자 데이터 타입
 */
import { PatientStatus } from './PatientCard';

export interface UnifiedPatient {
    id: string | number;
    name: string;
    age: string | number;
    visitType: '초진' | '재진';
    chiefComplaint: string;
    status: PatientStatus;
    reservationTime?: string;
    
    // 추가 정보 (선택적)
    patientId?: string;
    phone?: string;
    birthDate?: string;
    visitOrigin?: 'reservation' | 'walkin';
    alert?: string | null;
    alertType?: string | null;
    buttonText?: string;
    
    // 검사 관련 정보 (IN_TEST 상태일 때)
    tests?: Array<{
        testName: string;
        urgency: 'routine' | 'urgent';
        result?: string;
    }>;
    
    // 검사 체크리스트 (IN_TEST 상태일 때)
    testOrders?: Array<{
        id: string;
        testName: string;
        urgency: 'routine' | 'urgent';
        completed: boolean;
        completedAt?: string;
    }>;
    
    // 재방문 관련 정보 (NEED_REVISIT 상태일 때)
    revisitRecommendation?: string;
    nextVisit?: string;
    prescriptions?: Array<{
        medication: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
    aiSummary?: string; // AI 판단 요약 텍스트
    warningText?: string; // 경고 텍스트 (예: "검사 결과 확인 필요")
    
    // 처방/오더 원본 데이터 (상세보기용)
    prescriptionData?: any;
}
