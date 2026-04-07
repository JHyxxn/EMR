/**
 * 검사 플로우 UI 모듈 진입점
 * - ExamManagement 등에서 타입·유틸·컴포넌트 일괄 import
 */
export * from './types';
export { buildDummyExamOrders } from './dummyData';
export { buildExamOrdersFromPrescriptions } from './prescriptionToExamOrders';
export type { PrescriptionForExam } from './prescriptionToExamOrders';
export { buildTimeSlots, buildMatrix, buildOpsSummary, getPatientFlowSegments, EXAM_TYPE_LABELS, formatTimeForDisplay } from './examFlowUtils';
export { ExamFlowBoard } from './ExamFlowBoard';
export { ExamCell } from './ExamCell';
export { PatientCardMini } from './PatientCardMini';
export { PatientDetailPanel } from './PatientDetailPanel';
export { OpsSummaryPanel } from './OpsSummaryPanel';
