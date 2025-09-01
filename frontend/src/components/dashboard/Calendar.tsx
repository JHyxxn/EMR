import React, { useState } from 'react';
import { Card, SectionTitle, Button } from '../common';
import { tokens } from '../../design/tokens';

interface CalendarProps {
    onNewPatient?: () => void;
}

export const Calendar: React.FC<CalendarProps> = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // 예약 데이터 (실제로는 API에서 가져올 데이터)
    const appointments = [
        { date: 23, month: 7, year: 2025, patient: "김철수", time: "11:00" },
        { date: 25, month: 7, year: 2025, patient: "홍길동", time: "14:00" },
        { date: 2, month: 8, year: 2025, patient: "이지현", time: "09:30" },
    ];

    // 달력 생성 함수
    const generateCalendar = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendar = [];
        const today = new Date();

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const hasAppointment = appointments.some(apt => 
                apt.date === date.getDate() && 
                apt.month === date.getMonth() && 
                apt.year === date.getFullYear()
            );

            calendar.push({
                date: date.getDate(),
                isCurrentMonth,
                isToday,
                hasAppointment
            });
        }

        return calendar;
    };

    const calendarDays = generateCalendar(currentYear, currentMonth);

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const monthNames = [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
    ];

    return (
        <div style={{ 
            background: "white", 
            borderRadius: tokens.borderRadius.md,
            padding: tokens.space.md,
            border: "1px solid #e5e7eb",
            marginBottom: tokens.space.md
        }}>
            <div style={{ 
                fontSize: "16px", 
                fontWeight: 700, 
                marginBottom: tokens.space.md,
                color: "#374151",
                textAlign: "center"
            }}>
                캘린더
            </div>
            
            {/* 월 네비게이션 */}
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: tokens.space.md 
            }}>
                <button 
                    onClick={goToPreviousMonth}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#6b7280"
                    }}
                >
                    ‹
                </button>
                <div style={{ 
                    fontSize: tokens.fontSize.md, 
                    fontWeight: 600,
                    color: "#374151"
                }}>
                    {currentYear}년 {monthNames[currentMonth]}
                </div>
                <button 
                    onClick={goToNextMonth}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#6b7280"
                    }}
                >
                    ›
                </button>
            </div>

            {/* 요일 헤더 */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(7, 1fr)", 
                gap: "2px",
                marginBottom: "4px"
            }}>
                {["일", "월", "화", "수", "목", "금", "토"].map(day => (
                    <div key={day} style={{ 
                        textAlign: "center", 
                        fontSize: "12px", 
                        fontWeight: 600,
                        color: "#6b7280",
                        padding: "4px"
                    }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* 달력 그리드 */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(7, 1fr)", 
                gap: "2px"
            }}>
                {calendarDays.map((day, index) => (
                    <div key={index} style={{
                        aspectRatio: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        position: "relative",
                        background: day.isToday ? "rgba(93, 109, 126, 0.15)" : "transparent",
                        color: day.isToday ? "#5D6D7E" : (day.isCurrentMonth ? "#374151" : "#d1d5db"),
                        fontWeight: day.isToday ? 600 : 400
                    }}>
                        {day.date}
                        {day.hasAppointment && (
                            <div style={{
                                position: "absolute",
                                bottom: "2px",
                                width: "4px",
                                height: "4px",
                                background: "#CB670E",
                                borderRadius: "50%"
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* 예약 표시 설명 */}
            <div style={{ 
                marginTop: tokens.space.sm, 
                fontSize: "11px", 
                color: "#6b7280",
                textAlign: "center"
            }}>
                <span style={{ color: "#CB670E" }}>●</span> 예약 있음
            </div>
        </div>
    );
};
