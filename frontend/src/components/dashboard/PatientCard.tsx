/**
 * 환자 카드 공통 컴포넌트
 */
import React from 'react';

export type PatientStatus = 'WAITING' | 'IN_TEST' | 'NEED_REVISIT';

interface PatientCardProps {
    patientId: string | number;
    name: string;
    age: string | number;
    visitType: '초진' | '재진';
    chiefComplaint: string;
    status: PatientStatus;
    reservationTime?: string;
    children?: React.ReactNode; // 액션 버튼 등 추가 컨텐츠
    className?: string;
    style?: React.CSSProperties;
    layout?: 'column' | 'row'; // 레이아웃 방향 (기본값: column)
}

export const PatientCard: React.FC<PatientCardProps> = ({
    patientId,
    name,
    age,
    visitType,
    chiefComplaint,
    status,
    reservationTime,
    children,
    className,
    style,
    layout = 'column'
}) => {
    // status에 따른 배경색 및 테두리 색상 결정
    const getStatusStyles = (status: PatientStatus) => {
        switch (status) {
            case 'WAITING':
                return {
                    background: 'white',
                    border: '1px solid #e5e7eb'
                };
            case 'IN_TEST':
                return {
                    background: '#fef2f2',
                    border: '1px solid #fecaca'
                };
            case 'NEED_REVISIT':
                return {
                    background: 'white',
                    border: '1px solid #e5e7eb'
                };
            default:
                return {
                    background: 'white',
                    border: '1px solid #e5e7eb'
                };
        }
    };

    const statusStyles = getStatusStyles(status);

    return (
        <div
            className={className}
            style={{
                padding: '16px',
                background: statusStyles.background,
                borderRadius: '8px',
                border: statusStyles.border,
                display: 'flex',
                flexDirection: layout,
                gap: layout === 'row' ? '16px' : '8px',
                alignItems: layout === 'row' ? 'center' : 'stretch',
                ...style
            }}
        >
            {/* 환자 정보 영역 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                flex: layout === 'row' ? 1 : undefined
            }}>
                {/* 예약 시간 (있는 경우) */}
                {reservationTime && (
                    <div style={{
                        fontSize: layout === 'row' ? '16px' : '14px',
                        fontWeight: 700,
                        color: '#374151',
                        marginBottom: layout === 'row' ? '4px' : '0'
                    }}>
                        {reservationTime}
                    </div>
                )}

                {/* 환자 기본 정보 */}
                <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151'
                }}>
                    {name} ({age}세, {visitType})
                </div>
                <div style={{
                    fontSize: '13px',
                    color: '#6b7280'
                }}>
                    {chiefComplaint || '증상 없음'}
                </div>
            </div>

            {/* 추가 컨텐츠 (액션 버튼 등) */}
            {children && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    ...(layout === 'column' && { marginTop: '8px' })
                }}>
                    {children}
                </div>
            )}
        </div>
    );
};
