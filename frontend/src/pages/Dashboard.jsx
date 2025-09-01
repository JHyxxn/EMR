
// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react'
import { Obs } from '../api'
import Card from '../components/Card'
import { usePatientStore } from '../hooks/patientStoreContext.jsx'

export default function Dashboard() {
    const { patient } = usePatientStore()
    const [alerts, setAlerts] = useState(null)

    // 빠른 입력 폼 상태
    const [form, setForm] = useState({
        codeLoinc: 'BP-SYS',
        value: '150',
        unit: 'mmHg'
    })
    const [msg, setMsg] = useState('')

    async function loadAlerts() {
        if (!patient) return setAlerts(null)
        try {
            const data = await Obs.getAlerts(patient.id)
            setAlerts(data)
        } catch {
            setAlerts({ hasAlert: false, summary: [] })
        }
    }

    useEffect(() => { loadAlerts() }, [patient])

    function onCodeChange(v) {
        setForm(f => {
            if (v === 'BP-SYS' || v === 'BP-DIA') return { ...f, codeLoinc: v, unit: 'mmHg', value: v === 'BP-DIA' ? '95' : '150' }
            if (v === 'GLU-FBS') return { ...f, codeLoinc: v, unit: 'mg/dL', value: '210' }
            return { ...f, codeLoinc: v }
        })
    }

    async function saveObservation() {
        if (!patient) return alert('먼저 환자를 선택하세요 (상단 네비 → 환자 검색)')
        try {
            setMsg('저장 중…')
            await Obs.createObservation({
                patientId: patient.id,
                category: ['BP-SYS','BP-DIA'].includes(form.codeLoinc) ? 'vital' : 'lab',
                codeLoinc: form.codeLoinc,
                value: Number(form.value),
                unit: form.unit
            })
            setMsg('저장 완료')
            await loadAlerts()
            setTimeout(() => setMsg(''), 1500)
        } catch (e) {
            setMsg(e.detail?.error || e.message)
        }
    }

    return (
        <div className="grid gap-6">
            <Card title="관찰치 빠른 입력 (선택 환자 기준)">
                {!patient ? (
                    <div className="text-sm text-slate-500">환자를 먼저 선택하세요. (상단 네비의 "환자 검색")</div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm">대상: {patient.name} (id:{patient.id})</span>
                        <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={form.codeLoinc} onChange={e=>onCodeChange(e.target.value)}>
                            <option value="BP-SYS">BP-SYS (수축기)</option>
                            <option value="BP-DIA">BP-DIA (이완기)</option>
                            <option value="GLU-FBS">GLU-FBS (공복혈당)</option>
                        </select>
                        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 w-24" type="number"
                               value={form.value} onChange={e=>setForm(f=>({ ...f, value: e.target.value }))}/>
                        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 w-28"
                               value={form.unit} onChange={e=>setForm(f=>({ ...f, unit: e.target.value }))}/>
                        <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50" onClick={saveObservation}>저장</button>
                        <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50" onClick={loadAlerts}>새로고침</button>
                        <span className="text-sm text-slate-500">{msg}</span>
                    </div>
                )}
            </Card>

            <Card title="Clinical Alerts (최근 24h)">
                {!patient ? (
                    '환자를 선택하면 알림을 보여줍니다.'
                ) : !alerts ? (
                    '불러오는 중…'
                ) : alerts.hasAlert ? (
                    <ul className="list-disc pl-5">
                        {alerts.summary.slice(0,5).map((a, idx) => (
                            <li key={idx} className="text-sm">
                                {a.code} = {a.value}{a.unit || ''} &nbsp;
                                <span className="text-rose-600">{a.flags.join(', ')}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    '특이 알림 없음'
                )}
            </Card>
        </div>
    )
}