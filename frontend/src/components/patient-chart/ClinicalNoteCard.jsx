/**
 * AI 임상 요약 카드 (제목·본문·하이라이트·복사)
 *
 * 담당자: 오수민 (AI, Frontend)
 *
 * - `PatientChartModal` 등에서 LLM/룰 기반 요약 표시용
 *
 * props: title?, summary?, provider? ('rule' | 'llm' | string), highlights?
 */
import Card from './Card'
import { useState } from 'react'

export default function ClinicalNoteCard({ title = 'AI 임상 요약', summary = '', provider, highlights = [] }) {
    const [copied, setCopied] = useState(false)

    async function copy() {
        try {
            await navigator.clipboard.writeText(summary || '')
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        } catch { /* noop */ }
    }

    const badge =
        provider === 'llm'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-sky-100 text-sky-700'

    return (
        <Card title={title}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded ${badge}`}>
                    provider: {provider || 'unknown'}
                </span>
                <button 
                    className="rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50" 
                    onClick={copy}
                >
                    {copied ? '복사됨' : '복사'}
                </button>
            </div>

            <pre className="whitespace-pre-wrap text-sm leading-6">{summary || '요약이 없습니다.'}</pre>

            {highlights?.length > 0 && (
                <div className="mt-3">
                    <div className="text-xs text-slate-500 mb-1">하이라이트</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        {highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    )
}