/**
 * 금일 병원 일정 및 알림/업무 요약 컬럼 컴포넌트
 * 두 개의 독립적인 패딩으로 구성
 */
import React from 'react';

export const ScheduleAndAlertsColumn: React.FC = () => {
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

    // 오늘의 알림/업무 요약 데이터
    const alertItems = [
        {
            id: 'alert-1',
            title: '약품 대체 필요',
            description: 'Amlodipine 5mg 재고 부족 → 대체약 검토 필요',
            count: 3
        },
        {
            id: 'alert-2',
            title: '검사 결과 지연',
            description: '혈액검사 결과 지연 환자',
            count: 2
        },
        {
            id: 'alert-3',
            title: '소견서 미작성',
            description: '검사 완료 후 소견서 미작성',
            count: 1
        },
        {
            id: 'alert-4',
            title: '재진 대기 중 환자',
            description: '검사 완료 후 재진 대기',
            count: 2
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

                {/* 알림 체크리스트 */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    {alertItems.map((alert) => (
                        <div
                            key={alert.id}
                            style={{
                                padding: "12px 16px",
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px"
                            }}
                        >
                            {/* 상단: 체크박스 + 제목 + 상세보기 버튼 */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "8px"
                            }}>
                                {/* 체크박스 */}
                                <input
                                    type="checkbox"
                                    style={{
                                        cursor: "pointer",
                                        width: "16px",
                                        height: "16px",
                                        flexShrink: 0
                                    }}
                                />
                                {/* 제목 */}
                                <div style={{
                                    flex: 1,
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "#374151"
                                }}>
                                    {alert.title}
                                </div>
                                {/* 상세보기 버튼 */}
                                <button
                                    style={{
                                        padding: "4px 8px",
                                        background: "#f3f4f6",
                                        color: "#374151",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#e5e7eb";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#f3f4f6";
                                    }}
                                >
                                    상세보기
                                </button>
                            </div>
                            {/* 하단: 설명 */}
                            <div style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                lineHeight: "1.6",
                                paddingLeft: "28px"
                            }}>
                                {alert.description}
                                {alert.count > 0 && (
                                    <span style={{ color: "#6b7280" }}>
                                        ({alert.count}건)
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
