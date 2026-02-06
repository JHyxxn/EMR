/**
 * 금일 병원 일정 및 알림/업무 요약 컬럼 컴포넌트
 * 두 개의 독립적인 패딩으로 구성
 */
import React, { useState, useCallback } from 'react';

export const ScheduleAndAlertsColumn: React.FC = () => {
    // 알림 카드 펼침 상태 (여러 개 동시 펼치기 가능)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    // 건별 체크 상태 (키: 'alertId-detailIndex') → 체크된 항목은 해당 카테고리에서 숨기고 '완료한 항목' 박스로
    const [checkedDetailKeys, setCheckedDetailKeys] = useState<Set<string>>(new Set());

    const toggleExpand = useCallback((id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleDetailCheck = useCallback((alertId: string, detailIndex: number) => {
        const key = `${alertId}-${detailIndex}`;
        setCheckedDetailKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);
    // 오늘 날짜 포맷팅 (26.02.04 형식) - 매일 자동 업데이트
    const today = new Date();
    const formattedDate = `${today.getFullYear().toString().slice(2)}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;

    // 금일 병원 일정 데이터
    const scheduleItems = [
        {
            id: 'schedule-1',
            doctor: '박 교수님',
            type: '외래 진료',
            time: '09:00 – 12:00',
            reservation: 18,
            completed: 11
        },
        {
            id: 'schedule-2',
            doctor: '임 교수님',
            type: '외래 진료',
            time: '13:30 – 17:00',
            reservation: 14,
            completed: 6
        },
        {
            id: 'schedule-3',
            doctor: null,
            type: '검사실 운영 시간',
            time: '09:00 – 18:00',
            reservation: null,
            completed: null
        },
        {
            id: 'schedule-4',
            doctor: null,
            type: '검사 대기 증가 예상',
            time: '14:00 – 16:00',
            reservation: '예약 검사',
            completed: null
        }
    ];

    // 오늘의 알림/업무 요약 데이터 (건별 목록 포함)
    const alertItems = [
        {
            id: 'alert-1',
            title: '약품 대체 필요',
            description: 'Amlodipine 5mg 재고 부족 → 대체약 검토 필요',
            count: 3,
            details: [
                { patientName: '김○○', extra: 'Amlodipine 5mg' },
                { patientName: '이○○', extra: 'Amlodipine 5mg' },
                { patientName: '박○○', extra: 'Amlodipine 5mg' }
            ]
        },
        {
            id: 'alert-2',
            title: '검사 결과 지연',
            description: '혈액검사 결과 지연 환자',
            count: 2,
            details: [
                { patientName: '최○○', extra: 'CBC' },
                { patientName: '정○○', extra: '혈청검사' }
            ]
        },
        {
            id: 'alert-3',
            title: '소견서 미작성',
            description: '검사 완료 후 소견서 미작성',
            count: 1,
            details: [{ patientName: '한○○', extra: '검사완료 02.05' }]
        },
        {
            id: 'alert-4',
            title: '재진 대기 중 환자',
            description: '검사 완료 후 재진 대기',
            count: 2,
            details: [
                { patientName: '강○○', extra: '재진 예약 대기' },
                { patientName: '조○○', extra: '재진 예약 대기' }
            ]
        }
    ];

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        }}>
            {/* 패딩 1: 금일 병원 일정 */}
            <div style={{
                background: "white",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                minHeight: "fit-content"
            }}>
                <div style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "16px",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span>금일 병원 일정</span>
                    <span style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#6b7280"
                    }}>
                        ({formattedDate})
                    </span>
                </div>

                {/* 일정 리스트 */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    {scheduleItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                padding: "12px 16px",
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                fontSize: "15px",
                                color: "#374151",
                                lineHeight: "1.6",
                                fontWeight: 600
                            }}
                        >
                            {item.doctor ? (
                                <>
                                    <span>{item.doctor}</span> {item.type} {item.time}
                                    {item.reservation !== null && item.completed !== null && (
                                        <span style={{ color: "#6b7280", marginLeft: "8px", fontWeight: 500 }}>
                                            (예약 {item.reservation} / 완료 {item.completed})
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    {item.type} {item.time}
                                    {item.reservation && (
                                        <span style={{ color: "#6b7280", marginLeft: "8px", fontWeight: 500 }}>
                                            ({item.reservation})
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 패딩 2: 오늘의 알림 / 업무 요약 */}
            <div style={{
                background: "white",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                minHeight: "fit-content"
            }}>
                <div style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "16px",
                    color: "#374151"
                }}>
                    오늘의 알림 / 업무 요약
                </div>

                {/* 알림 (접힌 상태: 제목+건수+화살표, 펼치면 설명+건별 체크리스트) */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    {alertItems.map((alert) => {
                        const isExpanded = expandedIds.has(alert.id);
                        const remainingCount = alert.details.filter((_, idx) => !checkedDetailKeys.has(`${alert.id}-${idx}`)).length;
                        const pendingDetails = alert.details
                            .map((d, idx) => ({ detail: d, idx }))
                            .filter(({ idx }) => !checkedDetailKeys.has(`${alert.id}-${idx}`));
                        return (
                            <div
                                key={alert.id}
                                style={{
                                    background: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    overflow: "hidden"
                                }}
                            >
                                {/* 한 줄: 제목 (미완료 N건) + 화살표만 */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "12px 16px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => toggleExpand(alert.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            toggleExpand(alert.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isExpanded}
                                    aria-label={isExpanded ? "접기" : "펼치기"}
                                >
                                    <div style={{
                                        flex: 1,
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        color: "#374151"
                                    }}>
                                        {alert.title} ({remainingCount}건)
                                    </div>
                                    <span style={{
                                        color: "#6b7280",
                                        fontSize: "16px",
                                        lineHeight: 1,
                                        display: "inline-flex",
                                        alignItems: "center"
                                    }}>
                                        {isExpanded ? "▼" : "▶"}
                                    </span>
                                </div>
                                {/* 펼쳐진 영역: 설명 + 미완료 목록 + 완료한 항목 보기 */}
                                {isExpanded && (
                                    <div style={{
                                        padding: "0 16px 12px 44px",
                                        borderTop: "1px solid #e5e7eb"
                                    }}>
                                        <div style={{
                                            fontSize: "13px",
                                            color: "#6b7280",
                                            lineHeight: "1.6",
                                            paddingTop: "10px",
                                            marginBottom: "10px"
                                        }}>
                                            {alert.description}
                                        </div>
                                        {/* 미완료 항목 (체크하면 목록에서 사라짐) */}
                                        <ul style={{
                                            margin: 0,
                                            paddingLeft: 0,
                                            listStyle: "none",
                                            fontSize: "13px",
                                            color: "#374151",
                                            lineHeight: "1.8"
                                        }}>
                                            {pendingDetails.map(({ detail, idx }, listIdx) => (
                                                <li
                                                    key={idx}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        padding: "6px 0",
                                                        borderBottom: listIdx < pendingDetails.length - 1 ? "1px solid #e5e7eb" : undefined
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={false}
                                                        onChange={() => toggleDetailCheck(alert.id, idx)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            cursor: "pointer",
                                                            width: "16px",
                                                            height: "16px",
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                    <span>
                                                        {detail.patientName}
                                                        {detail.extra && (
                                                            <span style={{ color: "#6b7280", marginLeft: "6px" }}>
                                                                · {detail.extra}
                                                            </span>
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        {pendingDetails.length === 0 && remainingCount === 0 && (
                                            <div style={{ fontSize: "13px", color: "#9ca3af", padding: "6px 0" }}>
                                                남은 항목 없음
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* 완료한 항목 박스 (체크된 항목이 여기로 모임) */}
                    {(() => {
                        const COMPLETED_BOX_ID = 'completed-box';
                        const isCompletedExpanded = expandedIds.has(COMPLETED_BOX_ID);
                        const completedList: { alertId: string; alertTitle: string; detail: { patientName: string; extra?: string }; idx: number }[] = [];
                        alertItems.forEach((alert) => {
                            alert.details.forEach((detail, idx) => {
                                if (checkedDetailKeys.has(`${alert.id}-${idx}`)) {
                                    completedList.push({ alertId: alert.id, alertTitle: alert.title, detail, idx });
                                }
                            });
                        });
                        const completedCount = completedList.length;

                        return (
                            <div
                                style={{
                                    background: "#f9fafb",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    overflow: "hidden"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "12px 16px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => toggleExpand(COMPLETED_BOX_ID)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            toggleExpand(COMPLETED_BOX_ID);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isCompletedExpanded}
                                    aria-label={isCompletedExpanded ? "접기" : "펼치기"}
                                >
                                    <div style={{
                                        flex: 1,
                                        fontSize: "15px",
                                        fontWeight: 600,
                                        color: "#374151"
                                    }}>
                                        완료한 항목 ({completedCount}건)
                                    </div>
                                    <span style={{
                                        color: "#6b7280",
                                        fontSize: "16px",
                                        lineHeight: 1,
                                        display: "inline-flex",
                                        alignItems: "center"
                                    }}>
                                        {isCompletedExpanded ? "▼" : "▶"}
                                    </span>
                                </div>
                                {isCompletedExpanded && (
                                    <div style={{
                                        padding: "10px 16px 12px 44px",
                                        borderTop: "1px solid #e5e7eb"
                                    }}>
                                        {completedCount === 0 ? (
                                            <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                                                완료한 항목 없음
                                            </div>
                                        ) : (
                                            <ul style={{
                                                margin: 0,
                                                paddingLeft: 0,
                                                listStyle: "none",
                                                fontSize: "13px",
                                                color: "#9ca3af",
                                                lineHeight: "1.8"
                                            }}>
                                                {completedList.map(({ alertId, alertTitle, detail, idx }, listIdx) => (
                                                    <li
                                                        key={`${alertId}-${idx}`}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                            padding: "6px 0",
                                                            borderBottom: listIdx < completedList.length - 1 ? "1px solid #e5e7eb" : undefined,
                                                            textDecoration: "line-through"
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked
                                                            onChange={() => toggleDetailCheck(alertId, idx)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "16px",
                                                                height: "16px",
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                        <span>
                                                            {detail.patientName}
                                                            {detail.extra && (
                                                                <span style={{ marginLeft: "6px" }}>
                                                                    · {detail.extra}
                                                                </span>
                                                            )}
                                                            <span style={{ marginLeft: "8px", fontSize: "12px", color: "#9ca3af" }}>
                                                                ({alertTitle})
                                                            </span>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};
