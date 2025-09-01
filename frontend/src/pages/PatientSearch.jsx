// src/pages/PatientSearch.jsx

import { useEffect, useState } from 'react'
import * as API from '../api'
import Card from '../components/Card'
import { usePatientStore } from '../hooks/patientStoreContext.jsx'

export default function PatientSearch() {
    const [q, setQ] = useState('')
    const [list, setList] = useState([])
    const [form, setForm] = useState({ mrn:'', name:'' })
    const { patient, setPatient } = usePatientStore()

    async function search() {
        const data = await API.Patients.searchPatients(q)
        setList(data)
    }

    async function create() {
        if (!form.mrn || !form.name) return alert('MRN, 이름 필수')
        await API.Patients.createPatient(form)
        setForm({ mrn:'', name:'' })
        await search()
    }

    useEffect(() => { search() }, [])

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card title="환자 검색">
                <div className="flex gap-2">
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 w-full" placeholder="이름 또는 MRN"
                           value={q} onChange={e=>setQ(e.target.value)} />
                    <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50" onClick={search}>검색</button>
                </div>
                <ul className="mt-4 divide-y">
                    {list.map(p => (
                        <li key={p.id} className="py-2 text-sm flex items-center justify-between">
                            <span>{p.mrn} · {p.name} · {p.sex ?? '-'}</span>
                            <div className="flex gap-2">
                                <button className="rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50" onClick={() => setPatient(p)}>선택</button>
                            </div>
                        </li>
                    ))}
                </ul>
                {patient && (
                    <div className="text-xs text-slate-500 mt-2">
                        현재 선택: {patient.name} (id:{patient.id})
                    </div>
                )}
            </Card>

            <Card title="환자 등록 (최소)">
                <div className="flex flex-col gap-2">
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="MRN"
                           value={form.mrn} onChange={e=>setForm(f=>({ ...f, mrn:e.target.value }))} />
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="이름"
                           value={form.name} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} />
                    <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50" onClick={create}>등록</button>
                </div>
            </Card>
        </div>
    )
}