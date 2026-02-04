/**
 * 검사 진행 환자 컬럼 컴포넌트
 */
import React from 'react';
import { UnifiedPatient } from './types';
import { ResultsReadyRow } from './ResultsReadyRow';
import { InProgressRow } from './InProgressRow';

interface InTestPatientsColumnProps {
    patients: UnifiedPatient[];
    searchQuery: string;
    onTestButton: (patient: any) => void;
    onPrescriptionClick: (prescription: any) => void;
    onRevisit?: (patient: UnifiedPatient) => void;
}

export const InTestPatientsColumn: React.FC<InTestPatientsColumnProps> = ({
    patients,
    searchQuery,
    onTestButton,
    onPrescriptionClick,
    onRevisit
}) => {
    // 검색어 매칭 함수
    const matchesSearch = (text: string, query: string) => {
        if (!query) return true;
        return text.toLowerCase().includes(query.toLowerCase());
    };

    // 검사 진행 중인 환자 필터링
    const filteredPatients = patients.filter(patient => {
        if (searchQuery) {
            return matchesSearch(patient.name, searchQuery);
        }
        return true;
    });

    // 검사 완료된 환자와 진행 중인 환자로 분리
    const resultsReadyPatients = filteredPatients.filter(patient => {
        // testOrders가 있고 모두 완료된 경우
        if (patient.testOrders && patient.testOrders.length > 0) {
            return patient.testOrders.every(t => t.completed);
        }
        // tests가 있고 모든 테스트에 result가 있는 경우
        if (patient.tests && patient.tests.length > 0) {
            return patient.tests.every(t => t.result);
        }
        return false;
    });

    const inProgressPatients = filteredPatients.filter(patient => {
        // testOrders가 있고 일부만 완료된 경우
        if (patient.testOrders && patient.testOrders.length > 0) {
            const completedCount = patient.testOrders.filter(t => t.completed).length;
            return completedCount > 0 && completedCount < patient.testOrders.length;
        }
        // tests가 있고 일부만 result가 있거나 모두 result가 없는 경우 (진행 중)
        if (patient.tests && patient.tests.length > 0) {
            const resultCount = patient.tests.filter(t => t.result).length;
            // 일부만 완료되었거나 모두 미완료인 경우
            return resultCount < patient.tests.length;
        }
        return false;
    });

    // 정렬 함수 - 검사 시작 시간순 (가장 빠른 환자부터)
    const sortPatients = (a: UnifiedPatient, b: UnifiedPatient) => {
        // reservationTime 순 (오름차순: 가장 빠른 시간부터)
        if (a.reservationTime && b.reservationTime) {
            return a.reservationTime.localeCompare(b.reservationTime);
        }
        // reservationTime이 없는 경우 prescriptionData의 createdAt 사용
        if (a.prescriptionData?.createdAt && b.prescriptionData?.createdAt) {
            return new Date(a.prescriptionData.createdAt).getTime() - new Date(b.prescriptionData.createdAt).getTime();
        }
        return 0;
    };

    const sortedResultsReady = [...resultsReadyPatients].sort(sortPatients);
    const sortedInProgress = [...inProgressPatients].sort(sortPatients);

    return (
        <div style={{ 
            background: "white", 
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 200px)",
            maxHeight: "800px"
        }}>
            <div style={{ 
                fontSize: "18px", 
                fontWeight: 700, 
                marginBottom: "16px",
                color: "#374151"
            }}>
                검사 진행
            </div>

            {sortedResultsReady.length === 0 && sortedInProgress.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6b7280",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        fontSize: "14px",
                        color: "#9ca3af"
                    }}>
                        검사 진행 중인 환자가 없습니다
                    </div>
                </div>
            ) : (
                <div style={{ 
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0
                }}>
                    {/* 상단: 검사 완료된 환자들 (resultsReadySection) */}
                    {sortedResultsReady.length > 0 && (
                        <div style={{ 
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            marginBottom: sortedInProgress.length > 0 ? "12px" : "0"
                        }}>
                            {sortedResultsReady.map((patient) => {
                                // 그래프 사이즈를 일관되게 4개로 고정
                                const actualSteps = patient.testOrders?.length || patient.tests?.length || 0;
                                const totalSteps = Math.max(actualSteps, 4); // 최소 4개, 실제 검사 항목이 더 많으면 그만큼
                                const doneSteps = totalSteps; // 모두 완료
                                const needsTransfer = patient.alert?.includes("상급병원") || false;
                                const summary = patient.aiSummary || patient.chiefComplaint || '';

                                return (
                                    <ResultsReadyRow
                                        key={patient.id}
                                        reservationTime={patient.reservationTime}
                                        name={patient.name}
                                        age={patient.age}
                                        visitType={patient.visitType}
                                        summary={summary}
                                        needsTransfer={needsTransfer}
                                        totalSteps={totalSteps}
                                        doneSteps={doneSteps}
                                        onRevisit={onRevisit ? () => onRevisit(patient) : undefined}
                                        onDetail={() => onPrescriptionClick(patient.prescriptionData || patient)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* 하단: 검사 진행 중인 환자들 (inProgressSection) */}
                    {sortedInProgress.length > 0 && (
                        <div style={{ 
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            paddingTop: sortedResultsReady.length > 0 ? "12px" : "0"
                        }}>
                            {sortedInProgress.map((patient) => {
                                // 그래프 사이즈를 일관되게 4개로 고정
                                const actualSteps = patient.testOrders?.length || patient.tests?.length || 0;
                                const totalSteps = Math.max(actualSteps, 4); // 최소 4개, 실제 검사 항목이 더 많으면 그만큼
                                const actualDoneSteps = patient.testOrders 
                                    ? patient.testOrders.filter(t => t.completed).length
                                    : patient.tests?.filter(t => t.result).length || 0;
                                // doneSteps는 실제 완료된 수를 사용하되, totalSteps를 초과하지 않도록
                                const doneSteps = Math.min(actualDoneSteps, totalSteps);
                                
                                // 현재 진행 중인 검사명 찾기
                                const currentTest = patient.testOrders?.find(t => !t.completed) || 
                                                   patient.tests?.find(t => !t.result);
                                const currentTestName = currentTest?.testName || patient.tests?.[0]?.testName || '검사';

                                return (
                                    <InProgressRow
                                        key={patient.id}
                                        reservationTime={patient.reservationTime}
                                        name={patient.name}
                                        age={patient.age}
                                        visitType={patient.visitType}
                                        summary={patient.chiefComplaint}
                                        currentTestName={currentTestName}
                                        totalSteps={totalSteps}
                                        doneSteps={doneSteps}
                                        onRevisit={onRevisit ? () => onRevisit(patient) : undefined}
                                        onDetail={() => onPrescriptionClick(patient.prescriptionData || patient)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
