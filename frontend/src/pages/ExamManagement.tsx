/**
 * 검사 관리 페이지 컴포넌트
 * 
 * 담당자: 김지현 (프론트엔드)
 * 
 * 주요 기능:
 * - 검사 오더 관리
 * - 검사 결과 입력 (혈압, 심전도, 혈당 등)
 * - AI 기반 검사 결과 분석 및 시각화
 * - 정상/비정상 수치 자동 판단 및 색상 표시
 * 
 * 기술 스택:
 * - React + TypeScript
 * - 조건부 렌더링 (정상/비정상 수치 시각적 구분)
 * - AI 분석 결과 표시
 * - 탭 기반 UI (검사 오더 / 검사 결과 / AI 분석)
 */
import React, { useState, useEffect } from 'react';
import { tokens } from '../design/tokens';
import { WaitingPatient } from '../data/waitingPatientsData';

interface ExamManagementProps {
    selectedPatient: WaitingPatient | null;
    onPatientClear: () => void;
    prescriptions?: Array<{
        id: string;
        patientName: string;
        patientId: string;
        tests: Array<{
            testName: string;
            urgency: 'routine' | 'urgent';
        }>;
        createdAt: string;
    }>;
}

interface ExamOrder {
    id: number;
    patientName?: string;
    patientId?: number;
    category: 'lab' | 'imaging' | 'procedure';
    code?: string;
    priority?: 'routine' | 'urgent' | 'stat';
    requestedAt?: string;
}

export const ExamManagement: React.FC<ExamManagementProps> = ({ selectedPatient, onPatientClear, prescriptions = [] }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'schedule'>('orders');
    
    // 검사 오더 관련 상태
    const [examOrders, setExamOrders] = useState<ExamOrder[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<ExamOrder | null>(null);
    const [orderFilter, setOrderFilter] = useState<{
        patient?: string;
        category?: string;
        date?: string;
    }>({});
    // 연간 캘린더용 (예약 대시보드와 동일 레이아웃)
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

    // prescriptions에서 검사 오더 자동 생성
    useEffect(() => {
        const newOrders: ExamOrder[] = [];
        prescriptions.forEach(prescription => {
            if (prescription.tests && prescription.tests.length > 0) {
                prescription.tests.forEach(test => {
                    // 이미 존재하는 오더인지 확인 (중복 방지)
                    const existingOrder = examOrders.find(order => 
                        order.patientName === prescription.patientName &&
                        order.code === test.testName &&
                        new Date(order.requestedAt || '').toDateString() === new Date(prescription.createdAt).toDateString()
                    );
                    
                    if (!existingOrder) {
                        // 검사명에 따라 카테고리 자동 분류
                        let category: 'lab' | 'imaging' | 'procedure' = 'lab';
                        if (test.testName.includes('CT') || test.testName.includes('X-ray') || test.testName.includes('MRI') || test.testName.includes('초음파')) {
                            category = 'imaging';
                        } else if (test.testName.includes('내시경') || test.testName.includes('처치')) {
                            category = 'procedure';
                        }

                        newOrders.push({
                            id: Date.now() + Math.random(), // 고유 ID 생성
                            patientName: prescription.patientName,
                            patientId: parseInt(prescription.patientId) || undefined,
                            category,
                            code: test.testName,
                            priority: test.urgency === 'urgent' ? 'urgent' : 'routine',
                            requestedAt: prescription.createdAt
                        });
                    }
                });
            }
        });

        if (newOrders.length > 0) {
            setExamOrders(prev => {
                // 중복 제거를 위해 기존 오더와 병합
                const merged = [...prev];
                newOrders.forEach(newOrder => {
                    const exists = merged.some(existing => 
                        existing.patientName === newOrder.patientName &&
                        existing.code === newOrder.code &&
                        existing.requestedAt === newOrder.requestedAt
                    );
                    if (!exists) {
                        merged.push(newOrder);
                    }
                });
                return merged;
            });
        }
    }, [prescriptions]);

    // 검사 오더 생성/수정 핸들러
    const handleEditOrder = (order: ExamOrder) => {
        setEditingOrder(order);
        setShowOrderModal(true);
    };

    const handleDeleteOrder = (id: number) => {
        if (window.confirm('검사 오더를 삭제하시겠습니까?')) {
            setExamOrders(prev => prev.filter(order => order.id !== id));
        }
    };

    const handleSaveOrder = (orderData: Omit<ExamOrder, 'id'>) => {
        if (editingOrder) {
            // 수정
            setExamOrders(prev => prev.map(order => order.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : order));
        } else {
            // 생성
            const newOrder: ExamOrder = {
                ...orderData,
                id: Date.now()
            };
            setExamOrders(prev => [...prev, newOrder]);
        }
        setShowOrderModal(false);
        setEditingOrder(null);
    };

    // 연간 캘린더용: 월별 캘린더 생성
    const generateMonthCalendar = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        const calendar = [];
        const today = new Date();
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = dateStr === selectedDate;
            const orderCount = examOrders.filter(o => {
                const d = o.requestedAt ? new Date(o.requestedAt).toISOString().split('T')[0] : '';
                return d === dateStr;
            }).length;
            calendar.push({
                date: date.getDate(),
                dateStr,
                isCurrentMonth,
                isToday,
                isSelected,
                orderCount
            });
        }
        return calendar;
    };

    const generateYearCalendars = (year: number) => {
        const monthNames = [
            '1월', '2월', '3월', '4월', '5월', '6월',
            '7월', '8월', '9월', '10월', '11월', '12월'
        ];
        const months = [];
        for (let month = 0; month < 12; month++) {
            months.push({
                month,
                monthName: monthNames[month],
                calendar: generateMonthCalendar(year, month)
            });
        }
        const reorderedMonths = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const monthIndex = row + col * 4;
                if (monthIndex < 12) reorderedMonths.push(months[monthIndex]);
            }
        }
        return reorderedMonths;
    };

    const yearCalendars = generateYearCalendars(currentYear);
    const filteredOrdersByDate = examOrders.filter(o => {
        const d = o.requestedAt ? new Date(o.requestedAt).toISOString().split('T')[0] : '';
        return d === selectedDate;
    });

    // 08:00~18:00 30분 간격 타임 슬롯 (20개)
    const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
        const h = 8 + Math.floor(i / 2);
        const m = (i % 2) * 30;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    });
    const ordersByTimeSlot: Record<string, ExamOrder[]> = {};
    TIME_SLOTS.forEach(slot => { ordersByTimeSlot[slot] = []; });
    filteredOrdersByDate.forEach(order => {
        if (!order.requestedAt) return;
        const d = new Date(order.requestedAt);
        const hours = d.getHours();
        const minutes = d.getMinutes();
        if (hours < 8 || hours > 17 || (hours === 17 && minutes > 30)) return;
        const slotIndex = (hours - 8) * 2 + (minutes >= 30 ? 1 : 0);
        const slot = TIME_SLOTS[slotIndex];
        if (!ordersByTimeSlot[slot]) ordersByTimeSlot[slot] = [];
        ordersByTimeSlot[slot].push(order);
    });

    const changeSelectedDateByDays = (delta: number) => {
        const d = new Date(selectedDate + 'T12:00:00');
        d.setDate(d.getDate() + delta);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ 
                        fontSize: '28px', 
                        fontWeight: 700, 
                        color: tokens.colors.text.primary,
                        marginBottom: '8px'
                    }}>
                        검사 관리
                    </h1>
                    <p style={{ 
                        fontSize: '16px', 
                        color: tokens.colors.text.secondary 
                    }}>
                        검사 오더, 결과 입력 및 AI 분석을 관리합니다.
                    </p>
                </div>

                {selectedPatient && (
                    <div style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '16px', 
                                color: '#1e40af',
                                fontWeight: 600
                            }}>
                                검사 오더 작성 중: {selectedPatient.name} 환자
                            </h3>
                        </div>
                        <button
                            onClick={onPatientClear}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            선택 해제
                        </button>
                    </div>
                )}

                <div style={{ 
                    display: 'flex', 
                    borderBottom: '1px solid #e5e7eb',
                    marginBottom: '24px'
                }}>
                    {[
                        { key: 'orders', label: '검사 오더' },
                        { key: 'schedule', label: '검사 일정' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: activeTab === tab.key ? tokens.colors.primary : tokens.colors.text.secondary,
                                borderBottom: activeTab === tab.key ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 500
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'orders' && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        padding: '24px'
                    }}>
                        {/* 날짜 선택 */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary }}>
                                날짜
                            </span>
                            <button type="button" onClick={() => changeSelectedDateByDays(-1)} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>◀</button>
                            <span style={{ fontSize: '15px', fontWeight: 500, color: tokens.colors.text.primary, minWidth: '180px' }}>
                                {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                            </span>
                            <button type="button" onClick={() => changeSelectedDateByDays(1)} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>▶</button>
                        </div>

                        {/* 타임 스케줄표 08:00~18:00 30분 간격 */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '12px' }}>
                                타임 스케줄 (08:00 ~ 18:00)
                            </div>
                            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                                {TIME_SLOTS.map((slot) => (
                                    <div
                                        key={slot}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            minHeight: '44px',
                                            padding: '8px 16px',
                                            borderBottom: '1px solid #e5e7eb',
                                            backgroundColor: ordersByTimeSlot[slot]?.length ? '#f0f9ff' : 'white'
                                        }}
                                    >
                                        <div style={{ width: '56px', flexShrink: 0, fontWeight: 600, color: tokens.colors.text.primary }}>
                                            {slot}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                                            {(!ordersByTimeSlot[slot] || ordersByTimeSlot[slot].length === 0) ? (
                                                <span style={{ fontSize: '14px', color: tokens.colors.text.secondary }}>—</span>
                                            ) : (
                                                ordersByTimeSlot[slot].map((order) => (
                                                    <span
                                                        key={order.id}
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '13px',
                                                            backgroundColor: order.category === 'lab' ? '#dbeafe' : order.category === 'imaging' ? '#fef3c7' : '#fce7f3',
                                                            color: order.category === 'lab' ? '#1e40af' : order.category === 'imaging' ? '#92400e' : '#831843'
                                                        }}
                                                    >
                                                        {order.patientName || '환자'} · {order.code || '검사'}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 당일 검사 오더 목록 */}
                        <div style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '12px' }}>
                            검사 오더 목록 ({filteredOrdersByDate.length}건)
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '16px',
                            padding: '12px',
                            backgroundColor: tokens.colors.background.secondary,
                            borderRadius: '6px'
                        }}>
                            <select
                                value={orderFilter.patient || ''}
                                onChange={(e) => setOrderFilter({ ...orderFilter, patient: e.target.value })}
                                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', minWidth: '140px' }}
                            >
                                <option value="">전체 환자</option>
                            </select>
                            <select
                                value={orderFilter.category || ''}
                                onChange={(e) => setOrderFilter({ ...orderFilter, category: e.target.value })}
                                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', minWidth: '140px' }}
                            >
                                <option value="">전체 검사 유형</option>
                                <option value="lab">혈액검사</option>
                                <option value="imaging">영상검사</option>
                                <option value="procedure">처치</option>
                            </select>
                        </div>
                        {filteredOrdersByDate.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: tokens.colors.text.secondary }}>
                                해당 날짜에 검사 오더가 없습니다.
                            </div>
                        ) : (
                            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: tokens.colors.background.secondary, borderBottom: '2px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>환자명</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>검사 유형</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>검사 코드</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>우선순위</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>요청일시</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: tokens.colors.text.primary }}>작업</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrdersByDate.map((order) => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.colors.background.secondary; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}>
                                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{order.patientName || '환자 선택 필요'}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, backgroundColor: order.category === 'lab' ? '#dbeafe' : order.category === 'imaging' ? '#fef3c7' : '#fce7f3', color: order.category === 'lab' ? '#1e40af' : order.category === 'imaging' ? '#92400e' : '#831843' }}>
                                                        {order.category === 'lab' ? '혈액검사' : order.category === 'imaging' ? '영상검사' : '처치'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: tokens.colors.text.secondary }}>{order.code || '-'}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, backgroundColor: order.priority === 'urgent' ? '#fee2e2' : order.priority === 'stat' ? '#fecaca' : '#f0f9ff', color: order.priority === 'urgent' ? '#dc2626' : order.priority === 'stat' ? '#991b1b' : '#0369a1' }}>
                                                        {order.priority === 'urgent' ? '긴급' : order.priority === 'stat' ? '즉시' : '일반'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: tokens.colors.text.secondary }}>{order.requestedAt ? new Date(order.requestedAt).toLocaleString('ko-KR') : '-'}</td>
                                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => handleEditOrder(order)} style={{ padding: '6px 12px', backgroundColor: 'white', color: tokens.colors.primary, border: `1px solid ${tokens.colors.primary}`, borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>수정</button>
                                                        <button onClick={() => handleDeleteOrder(order.id)} style={{ padding: '6px 12px', backgroundColor: 'white', color: tokens.colors.error, border: `1px solid ${tokens.colors.error}`, borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <>
                        <div style={{
                            marginBottom: '24px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            padding: '24px'
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.text.primary, marginBottom: '16px' }}>
                                선택한 날짜: {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} · 검사 예약 {filteredOrdersByDate.length}건
                            </div>
                            {filteredOrdersByDate.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {filteredOrdersByDate.map((order) => (
                                        <span key={order.id} style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '14px', backgroundColor: '#f0f9ff', color: '#1e40af' }}>
                                            {order.patientName} · {order.code || '검사'}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            padding: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <button type="button" onClick={() => setCurrentYear(currentYear - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: tokens.colors.text.primary, padding: '8px' }}>◀</button>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.text.primary }}>{currentYear}</div>
                                <button type="button" onClick={() => setCurrentYear(currentYear + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: tokens.colors.text.primary, padding: '8px' }}>▶</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                {yearCalendars.map((monthData) => (
                                    <div key={monthData.month} style={{ marginBottom: '24px' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: tokens.colors.text.primary, textAlign: 'center' }}>{monthData.monthName}</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                                            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                                                <div key={day} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: index === 0 ? '#dc2626' : index === 6 ? '#2563eb' : '#6b7280', padding: '4px' }}>{day}</div>
                                            ))}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                            {monthData.calendar.map((day, index) => {
                                                const isSelected = day.dateStr === selectedDate;
                                                const hasOrders = day.orderCount > 0;
                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => day.isCurrentMonth && setSelectedDate(day.dateStr)}
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
                                                            backgroundColor: isSelected ? '#dbeafe' : day.isToday && !hasOrders ? 'rgba(59, 130, 246, 0.1)' : !day.isCurrentMonth ? '#f9fafb' : hasOrders ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                                            color: day.isCurrentMonth ? (isSelected ? '#1e40af' : '#374151') : '#d1d5db',
                                                            fontWeight: day.isToday || isSelected ? 600 : 400,
                                                            border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
                                                            minHeight: '32px'
                                                        }}
                                                    >
                                                        <span style={{ marginBottom: '2px' }}>{day.date}</span>
                                                        {hasOrders && (
                                                            <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '2px', backgroundColor: '#2563eb', borderRadius: '2px' }} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* 검사 오더 생성/수정 모달 */}
            {showOrderModal && (
                <ExamOrderModal
                    isOpen={showOrderModal}
                    onClose={() => {
                        setShowOrderModal(false);
                        setEditingOrder(null);
                    }}
                    onSubmit={handleSaveOrder}
                    editingOrder={editingOrder}
                    selectedPatient={selectedPatient}
                />
            )}
        </div>
    );
};

// 검사 오더 생성/수정 모달 컴포넌트
interface ExamOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: Omit<ExamOrder, 'id'>) => void;
    editingOrder: ExamOrder | null;
    selectedPatient: WaitingPatient | null;
}

const ExamOrderModal: React.FC<ExamOrderModalProps> = ({ isOpen, onClose, onSubmit, editingOrder, selectedPatient }) => {
    const [formData, setFormData] = useState({
        patientName: editingOrder?.patientName || selectedPatient?.name || '',
        patientId: editingOrder?.patientId || undefined,
        category: editingOrder?.category || 'lab' as 'lab' | 'imaging' | 'procedure',
        code: editingOrder?.code || '',
        priority: editingOrder?.priority || 'routine' as 'routine' | 'urgent' | 'stat'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            requestedAt: new Date().toISOString()
        });
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
                        {editingOrder ? '검사 오더 수정' : '신규 검사 오더'}
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
                        {/* 환자 선택 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                환자 *
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

                        {/* 검사 유형 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                검사 유형 *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="lab">혈액검사</option>
                                <option value="imaging">영상검사</option>
                                <option value="procedure">처치</option>
                            </select>
                        </div>

                        {/* 검사 코드 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                검사 코드
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="예: CBC, CT, X-ray 등"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* 우선순위 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: tokens.colors.text.primary
                            }}>
                                우선순위 *
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="routine">일반</option>
                                <option value="urgent">긴급</option>
                                <option value="stat">즉시</option>
                            </select>
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
                            {editingOrder ? '수정' : '생성'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};