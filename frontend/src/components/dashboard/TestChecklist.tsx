/**
 * 검사 체크리스트 컴포넌트
 */
import React from 'react';

export interface TestOrder {
    id: string;
    testName: string;
    urgency: 'routine' | 'urgent';
    completed: boolean;
    completedAt?: string;
}

interface TestChecklistProps {
    testOrders: TestOrder[];
    onToggleComplete?: (testId: string) => void;
}

export const TestChecklist: React.FC<TestChecklistProps> = ({
    testOrders,
    onToggleComplete
}) => {
    if (!testOrders || testOrders.length === 0) {
        return null;
    }

    const completedCount = testOrders.filter(t => t.completed).length;
    const totalCount = testOrders.length;

    return (
        <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb'
        }}>
            <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>검사 체크리스트</span>
                <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: 500
                }}>
                    {completedCount}/{totalCount} 완료
                </span>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            }}>
                {testOrders.map((test) => (
                    <div
                        key={test.id}
                        onClick={() => onToggleComplete?.(test.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            background: test.completed ? '#f9fafb' : 'transparent',
                            cursor: onToggleComplete ? 'pointer' : 'default',
                            transition: 'background-color 0.2s',
                            opacity: test.completed ? 0.6 : 1,
                            textDecoration: test.completed ? 'line-through' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (onToggleComplete && !test.completed) {
                                e.currentTarget.style.background = '#f3f4f6';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (onToggleComplete) {
                                e.currentTarget.style.background = test.completed ? '#f9fafb' : 'transparent';
                            }
                        }}
                    >
                        {/* 체크박스 아이콘 */}
                        <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: `2px solid ${test.completed ? '#10b981' : '#d1d5db'}`,
                            background: test.completed ? '#10b981' : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {test.completed && (
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 6L5 9L10 3"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </div>
                        
                        {/* 검사명 */}
                        <div style={{
                            flex: 1,
                            fontSize: '12px',
                            color: test.completed ? '#6b7280' : '#374151',
                            fontWeight: test.completed ? 400 : 500
                        }}>
                            {test.testName}
                        </div>
                        
                        {/* 긴급 표시 */}
                        {test.urgency === 'urgent' && !test.completed && (
                            <span style={{
                                padding: '2px 6px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 600
                            }}>
                                긴급
                            </span>
                        )}
                        
                        {/* 완료 시간 */}
                        {test.completed && test.completedAt && (
                            <span style={{
                                fontSize: '10px',
                                color: '#9ca3af'
                            }}>
                                {new Date(test.completedAt).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
