
// src/pages/ClinicalNote.jsx

import { useState } from 'react'
import { AI } from '../api'
import Card from '../components/Card'
import ClinicalNoteCard from '../components/ClinicalNoteCard'
import { usePatientStore } from '../hooks/patientStoreContext.jsx'

export default function ClinicalNote() {
    const { patient } = usePatientStore()
    const [text, setText] = useState('')
    const [provider, setProvider] = useState('rule')
    const [out, setOut] = useState(null)
    const [msg, setMsg] = useState('')

    async function run() {
        if (!patient) return alert('먼저 환자를 선택하세요.')
        try {
            setMsg('요약 중…')
            const res = await AI.clinicalNote(
                { patient: { id: patient.id, name: patient.name }, text },
                { provider }
            )
            setOut(res)
            setMsg('')
        } catch (e) {
            setMsg(e.detail?.error || e.message)
        }
    }

    return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card title="문진 텍스트">
                {!patient && <div className="text-sm text-slate-500 mb-2">환자를 먼저 선택하세요.</div>}
                <textarea className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none h-48"
                          value={text} onChange={e=>setText(e.target.value)} placeholder="문진 내용을 입력…" />
                <div className="flex items-center gap-2 mt-3">
                    <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" value={provider} onChange={e=>setProvider(e.target.value)}>
                        <option value="rule">Rule</option>
                        <option value="llm">LLM</option>
                    </select>
                    <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed" onClick={run} disabled={!patient}>AI 요약</button>
                    <span className="text-sm text-slate-500">{msg}</span>
                </div>
            </Card>

            <ClinicalNoteCard
                title="AI 임상 요약"
                summary={out?.summary}
                provider={out?.provider}
                highlights={out?.highlights || []}
            />
        </div>
    )
}