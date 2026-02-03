/**
 * 예약 관리 페이지 컴포넌트
 * 
 * 주요 기능:
 * - 1년 전체 세로형 스케줄 조회
 * - 교수님별 고정 스케줄 색상 배경 표시
 * - 예약 생성/수정/취소
 * - 의사별 휴일 표시
 * - 정기 예약(2-3달 주기) 표시
 */

import React, { useState, useEffect } from 'react';
import { tokens } from '../design/tokens';

interface Appointment {
    id: number;
    patientName: string;
    patientId?: number;
    practitionerName?: string;
    practitionerId?: number;
    startAt: string;
    endAt: string;
    reason?: string;
    status: 'proposed' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow';
    isRecurring?: boolean;
    recurringInterval?: number;
}

interface PractitionerSchedule {
    practitionerName: string;
    color: string; // 교수님별 고정 색상
    fixedSchedule: string[]; // 고정 스케줄 날짜들 (예: ['월', '수', '금'])
    specificDates?: string[]; // 특정 날짜들 (YYYY-MM-DD 형식)
}

interface PractitionerHoliday {
    practitionerName: string;
    date: string;
    reason?: string;
}

export const AppointmentManagement: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedPractitioners, setSelectedPractitioners] = useState<string[]>([]); // 선택된 교수님들

    // 교수님 목록 및 고정 스케줄
    const [practitionerSchedules, setPractitionerSchedules] = useState<PractitionerSchedule[]>([
        { 
            practitionerName: '오 교수님', 
            color: '#A8D5E2', // 파스텔 파란색
            fixedSchedule: ['월', '수'],
            specificDates: []
        },
        { 
            practitionerName: '임 교수님', 
            color: '#FFE5B4', // 파스텔 노란색
            fixedSchedule: ['월', '화', '목'],
            specificDates: []
        },
        { 
            practitionerName: '박 교수님', 
            color: '#B8E6B8', // 파스텔 초록색
            fixedSchedule: ['수', '목', '금'],
            specificDates: []
        },
    ]);

    // 의사별 휴일 데이터
    const [practitionerHolidays, setPractitionerHolidays] = useState<PractitionerHoliday[]>([
        { practitionerName: '오 교수님', date: '2026-02-10', reason: '개인 휴가' },
        { practitionerName: '임 교수님', date: '2026-02-15', reason: '학회 참석' },
        { practitionerName: '박 교수님', date: '2026-02-20', reason: '개인 휴가' },
    ]);

    // 예약 생성/수정 핸들러
    const handleEditAppointment = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setShowAppointmentModal(true);
    };

    const handleDeleteAppointment = (id: number) => {
        if (window.confirm('예약을 취소하시겠습니까?')) {
            setAppointments(prev => prev.map(apt => 
                apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
            ));
        }
    };

    const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
        if (editingAppointment) {
            setAppointments(prev => prev.map(apt => 
                apt.id === editingAppointment.id ? { ...appointmentData, id: editingAppointment.id } : apt
            ));
        } else {
            const newAppointment: Appointment = {
                ...appointmentData,
                id: Date.now()
            };
            setAppointments(prev => [...prev, newAppointment]);
        }
        setShowAppointmentModal(false);
        setEditingAppointment(null);
    };

    // 월별 캘린더 생성 함수
    const generateMonthCalendar = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendar = [];
        const today = new Date();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = dateStr === selectedDate;
            const dayOfWeek = dayNames[date.getDay()];
            
            // 해당 날짜의 교수님별 스케줄 확인
            const daySchedules: { practitionerName: string; color: string }[] = [];
            practitionerSchedules.forEach(schedule => {
                // 고정 스케줄 확인 (요일 기반)
                if (schedule.fixedSchedule.includes(dayOfWeek) && isCurrentMonth) {
                    daySchedules.push({
                        practitionerName: schedule.practitionerName,
                        color: schedule.color
                    });
                }
                // 특정 날짜 확인
                if (schedule.specificDates?.includes(dateStr)) {
                    if (!daySchedules.find(s => s.practitionerName === schedule.practitionerName)) {
                        daySchedules.push({
                            practitionerName: schedule.practitionerName,
                            color: schedule.color
                        });
                    }
                }
            });

            // 해당 날짜의 예약 목록
            const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.startAt).toISOString().split('T')[0];
                return aptDate === dateStr;
            });

            // 해당 날짜의 휴일 확인
            const dayHolidays = practitionerHolidays.filter(holiday => holiday.date === dateStr);

            calendar.push({
                date: date.getDate(),
                dateStr,
                isCurrentMonth,
                isToday,
                isSelected,
                dayOfWeek,
                schedules: daySchedules,
                appointments: dayAppointments,
                holidays: dayHolidays
            });
        }

        return calendar;
    };

    // 1년 전체 캘린더 생성
    const generateYearCalendars = (year: number) => {
        const months = [];
        const monthNames = [
            "1월", "2월", "3월", "4월", "5월", "6월",
            "7월", "8월", "9월", "10월", "11월", "12월"
        ];

        // 각 월의 캘린더 생성
        for (let month = 0; month < 12; month++) {
            months.push({
                month,
                monthName: monthNames[month],
                calendar: generateMonthCalendar(year, month)
            });
        }

        // 3x4 그리드로 재배치: 1월 5월 9월 / 2월 6월 10월 / 3월 7월 11월 / 4월 8월 12월
        // 각 행은 4개월 간격으로 배치
        const reorderedMonths = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const monthIndex = row + (col * 4);
                if (monthIndex < 12) {
                    reorderedMonths.push(months[monthIndex]);
                }
            }
        }

        return reorderedMonths;
    };

    const yearCalendars = generateYearCalendars(currentYear);

    // 선택된 날짜의 예약 필터링
    const filteredAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.startAt).toISOString().split('T')[0];
        return aptDate === selectedDate;
    });

    // 교수님 선택 토글
    const togglePractitioner = (practitionerName: string) => {
        setSelectedPractitioners(prev => 
            prev.includes(practitionerName)
                ? prev.filter(name => name !== practitionerName)
                : [...prev, practitionerName]
        );
    };

    // 날짜 셀의 배경색 결정 (여러 교수님 스케줄이 겹칠 경우)
    const getDateBackgroundStyle = (schedules: { practitionerName: string; color: string }[]) => {
        if (schedules.length === 0) {
            return { backgroundColor: 'transparent' };
        }
        if (schedules.length === 1) {
            return { backgroundColor: `${schedules[0].color}CC` }; // 파스텔 톤을 위해 투명도 적용
        }
        
        // 여러 교수님이 겹치는 경우 - 그라데이션 또는 분할 배경 (파스텔 톤)
        if (schedules.length === 2) {
            // 두 명이 겹치는 경우: 왼쪽 절반과 오른쪽 절반으로 나눔
            return {
                background: `linear-gradient(to right, ${schedules[0].color}CC 50%, ${schedules[1].color}CC 50%)`
            };
        }
        
        // 세 명이 겹치는 경우 (현재는 없지만 확장성을 위해)
        if (schedules.length === 3) {
            return {
                background: `linear-gradient(to right, ${schedules[0].color}CC 33.33%, ${schedules[1].color}CC 33.33%, ${schedules[1].color}CC 66.66%, ${schedules[2].color}CC 66.66%)`
            };
        }
        
        return { backgroundColor: `${schedules[0].color}CC` };
    };

    const monthNames = [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* 헤더 */}
                <div style={{ 
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: tokens.colors.text.primary
                    }}>
                        예약관리
                    </h1>
                    {/* 교수님 범례 */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {practitionerSchedules.map((schedule) => (
                            <div
                                key={schedule.practitionerName}
                                onClick={() => togglePractitioner(schedule.practitionerName)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: selectedPractitioners.includes(schedule.practitionerName)
                                        ? `${schedule.color}15`
                                        : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                    backgroundColor: schedule.color
                                }} />
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: tokens.colors.text.primary
                                }}>
                                    {schedule.practitionerName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 예약 목록 (캘린더 위에 배치) */}
                {selectedDate && (
                    <div style={{
                        marginBottom: '24px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        padding: '16px'
                    }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            marginBottom: '16px',
                            color: tokens.colors.text.primary
                        }}>
                            {new Date(selectedDate).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                            })} 예약 목록 ({filteredAppointments.length}건)
                        </div>

                        {filteredAppointments.length === 0 ? (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: tokens.colors.text.secondary
                            }}>
                                선택한 날짜에 예약이 없습니다.
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {filteredAppointments
                                    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                                    .map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            style={{
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                backgroundColor: 'white',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                                                    {appointment.patientName}
                                                </div>
                                                <div style={{ fontSize: '12px', color: tokens.colors.text.secondary }}>
                                                    {appointment.practitionerName || '-'} | {new Date(appointment.startAt).toLocaleTimeString('ko-KR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - {new Date(appointment.endAt).toLocaleTimeString('ko-KR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleEditAppointment(appointment)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: 'white',
                                                        color: tokens.colors.primary,
                                                        border: `1px solid ${tokens.colors.primary}`,
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAppointment(appointment.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: 'white',
                                                        color: tokens.colors.error,
                                                        border: `1px solid ${tokens.colors.error}`,
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 1년 전체 캘린더 (세로형) */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    padding: '24px'
                }}>
                    {/* 년도 표시 (상단 중앙) */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <button
                            onClick={() => setCurrentYear(currentYear - 1)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: tokens.colors.text.primary,
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ◀
                        </button>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: tokens.colors.text.primary
                        }}>
                            {currentYear}
                        </div>
                        <button
                            onClick={() => setCurrentYear(currentYear + 1)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: tokens.colors.text.primary,
                                padding: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ▶
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px'
                    }}>
                        {yearCalendars.map((monthData) => (
                            <div
                                key={monthData.month}
                                style={{
                                    marginBottom: '24px'
                                }}
                            >
                                    {/* 월 헤더 */}
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: 700,
                                        marginBottom: '8px',
                                        color: tokens.colors.text.primary,
                                        textAlign: 'center'
                                    }}>
                                        {monthData.monthName}
                                    </div>

                                    {/* 요일 헤더 */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '2px',
                                        marginBottom: '4px'
                                    }}>
                                        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                                            <div
                                                key={day}
                                                style={{
                                                    textAlign: 'center',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: index === 0 ? '#dc2626' : index === 6 ? '#2563eb' : '#6b7280',
                                                    padding: '4px'
                                                }}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* 캘린더 그리드 */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '2px'
                                    }}>
                                        {monthData.calendar.map((day, index) => {
                                            const bgStyle = getDateBackgroundStyle(day.schedules);
                                            const hasMultipleSchedules = day.schedules.length > 1;
                                            
                                            // 선택된 날짜나 오늘 날짜인 경우 배경색 처리
                                            let finalStyle = { ...bgStyle };
                                            if (day.isSelected) {
                                                finalStyle = { backgroundColor: '#dbeafe' };
                                            } else if (day.isToday && day.schedules.length === 0) {
                                                finalStyle = { backgroundColor: 'rgba(59, 130, 246, 0.1)' };
                                            } else if (day.schedules.length > 0 && !day.isSelected) {
                                                // 스케줄이 있는 경우 배경색에 투명도 적용 (파스텔 톤)
                                                if (day.schedules.length === 1) {
                                                    finalStyle = { backgroundColor: `${day.schedules[0].color}CC` };
                                                } else {
                                                    // 여러 명이 겹치는 경우 그라데이션에 투명도 적용
                                                    if (day.schedules.length === 2) {
                                                        finalStyle = {
                                                            background: `linear-gradient(to right, ${day.schedules[0].color}CC 50%, ${day.schedules[1].color}CC 50%)`
                                                        };
                                                    } else if (day.schedules.length === 3) {
                                                        finalStyle = {
                                                            background: `linear-gradient(to right, ${day.schedules[0].color}CC 33.33%, ${day.schedules[1].color}CC 33.33%, ${day.schedules[1].color}CC 66.66%, ${day.schedules[2].color}CC 66.66%)`
                                                        };
                                                    } else {
                                                        finalStyle = bgStyle;
                                                    }
                                                }
                                            } else if (!day.isCurrentMonth) {
                                                finalStyle = { backgroundColor: '#f9fafb' };
                                            }
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        if (day.isCurrentMonth) {
                                                            setSelectedDate(day.dateStr);
                                                        }
                                                    }}
                                                    style={{
                                                        aspectRatio: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        padding: '2px',
                                                        fontSize: '14px',
                                                        cursor: day.isCurrentMonth ? 'pointer' : 'default',
                                                        borderRadius: '4px',
                                                        position: 'relative',
                                                        ...finalStyle,
                                                        color: day.isCurrentMonth ? 
                                                              (day.isSelected ? '#1e40af' : '#374151') : 
                                                              '#d1d5db',
                                                        fontWeight: day.isToday || day.isSelected ? 600 : 400,
                                                        border: day.isSelected ? '2px solid #3b82f6' : '1px solid transparent',
                                                        transition: 'all 0.2s',
                                                        minHeight: '32px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (day.isCurrentMonth && !day.isSelected) {
                                                            if (day.schedules.length > 0) {
                                                                // 스케줄이 있는 경우 약간 밝게
                                                                e.currentTarget.style.opacity = '0.8';
                                                            } else {
                                                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                            }
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (day.isCurrentMonth && !day.isSelected) {
                                                            e.currentTarget.style.opacity = '1';
                                                            // 원래 스타일로 복원
                                                            Object.assign(e.currentTarget.style, finalStyle);
                                                        }
                                                    }}
                                                    title={day.schedules.length > 0 
                                                        ? day.schedules.map(s => s.practitionerName).join(', ')
                                                        : ''}
                                                >
                                                    <div style={{ marginBottom: '2px', zIndex: 1 }}>{day.date}</div>
                                                    
                                                    {/* 휴일 표시 */}
                                                    {day.holidays.length > 0 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '2px',
                                                            right: '2px',
                                                            width: '4px',
                                                            height: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f59e0b',
                                                            border: '1px solid white'
                                                        }} />
                                                    )}
                                                    
                                                    {/* 예약 표시 */}
                                                    {day.appointments.length > 0 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '2px',
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            width: '6px',
                                                            height: '2px',
                                                            backgroundColor: '#dc2626',
                                                            borderRadius: '2px'
                                                        }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>

            {/* 예약 생성/수정 모달 */}
            {showAppointmentModal && (
                <AppointmentModal
                    isOpen={showAppointmentModal}
                    onClose={() => {
                        setShowAppointmentModal(false);
                        setEditingAppointment(null);
                    }}
                    onSubmit={handleSaveAppointment}
                    editingAppointment={editingAppointment}
                    selectedDate={selectedDate}
                    practitioners={practitionerSchedules.map(s => s.practitionerName)}
                />
            )}
        </div>
    );
};

// 예약 생성/수정 모달 컴포넌트
interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (appointmentData: Omit<Appointment, 'id'>) => void;
    editingAppointment: Appointment | null;
    selectedDate: string;
    practitioners: string[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingAppointment,
    selectedDate,
    practitioners
}) => {
    const [formData, setFormData] = useState({
        patientName: editingAppointment?.patientName || '',
        patientId: editingAppointment?.patientId,
        practitionerName: editingAppointment?.practitionerName || practitioners[0] || '',
        practitionerId: editingAppointment?.practitionerId,
        startAt: editingAppointment?.startAt || `${selectedDate}T09:00`,
        endAt: editingAppointment?.endAt || `${selectedDate}T09:30`,
        reason: editingAppointment?.reason || '',
        status: editingAppointment?.status || 'booked' as Appointment['status'],
        isRecurring: editingAppointment?.isRecurring || false,
        recurringInterval: editingAppointment?.recurringInterval || 2
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '16px'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        margin: 0,
                        color: tokens.colors.text.primary
                    }}>
                        {editingAppointment ? '예약 수정' : '신규 예약'}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '4px'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                환자명 *
                            </label>
                            <input
                                type="text"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                placeholder="환자명을 입력하세요"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                교수님 *
                            </label>
                            <select
                                value={formData.practitionerName}
                                onChange={(e) => setFormData({ ...formData, practitionerName: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                {practitioners.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                날짜 *
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setFormData({
                                        ...formData,
                                        startAt: `${newDate}T${formData.startAt.split('T')[1]}`,
                                        endAt: `${newDate}T${formData.endAt.split('T')[1]}`
                                    });
                                }}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                시작 시간 *
                            </label>
                            <input
                                type="time"
                                value={formData.startAt.split('T')[1]}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    startAt: `${formData.startAt.split('T')[0]}T${e.target.value}`
                                })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                종료 시간 *
                            </label>
                            <input
                                type="time"
                                value={formData.endAt.split('T')[1]}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    endAt: `${formData.endAt.split('T')[0]}T${e.target.value}`
                                })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: tokens.colors.text.primary
                            }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isRecurring}
                                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                                />
                                정기 예약 (2-3달 주기)
                            </label>
                            {formData.isRecurring && (
                                <div style={{ marginTop: '8px' }}>
                                    <select
                                        value={formData.recurringInterval}
                                        onChange={(e) => setFormData({ ...formData, recurringInterval: parseInt(e.target.value) })}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value={2}>2개월</option>
                                        <option value={3}>3개월</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                사유
                            </label>
                            <input
                                type="text"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="예약 사유를 입력하세요"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end',
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'white',
                                color: tokens.colors.text.primary,
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: tokens.colors.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            {editingAppointment ? '수정' : '생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
