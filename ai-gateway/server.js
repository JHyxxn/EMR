// ai-gateway/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 5001);

/** -------------------------
 *  공통: 간단 LLM 호출 함수
 *  ------------------------- */
async function callLLM({ system, prompt, model = process.env.AI_MODEL || 'gpt-4o-mini' }) {
    if (!process.env.OPENAI_API_KEY) throw new Error('NO_API_KEY');

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3
        })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || 'LLM_ERROR');
    return data.choices?.[0]?.message?.content ?? '';
}

/** -------------------------
 *  공통: 임계치 계산(룰)
 *  ------------------------- */
function calcFlagsForObservation({ codeLoinc, value }) {
    const flags = [];
    const v = Number(value);
    if (codeLoinc === 'BP-SYS' && !Number.isNaN(v) && v >= 140) flags.push('HIGH_BP_SYSTOLIC');
    if (codeLoinc === 'BP-DIA' && !Number.isNaN(v) && v >= 90)  flags.push('HIGH_BP_DIASTOLIC');
    if (codeLoinc === 'GLU-FBS' && !Number.isNaN(v) && v >= 200) flags.push('HIGH_GLUCOSE');
    return flags;
}

/** -------------------------
 *  Health
 *  ------------------------- */
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'ai-gateway' });
});

/** -------------------------
 *  임상노트 요약
 *  - ?provider=rule | llm  (llm 실패 시 rule 폴백)
 *  ------------------------- */
app.post('/insight/clinical-note', async (req, res) => {
    try {
        const provider = (req.query.provider || 'rule').toLowerCase();
        const { text = '', patient = {} } = req.body ?? {};
        const name = patient?.name ?? '환자';
        const short = text.length > 400 ? text.slice(0, 400) + '…' : text;

        if (provider === 'llm' && process.env.OPENAI_API_KEY) {
            try {
                const llmText = await callLLM({
                    system: '의학적 단정 금지. 관찰 기반으로 2~4문장 요약. 한국어.',
                    prompt: `다음 문진 내용을 2~3문장으로 요약하고, 위험 신호가 있으면 마지막에 한 문장으로 조심스럽게 제안해줘.
- 환자: ${name} ${patient?.age ? `${patient.age}세` : ''} ${patient?.sex || ''}
- 문진: """${short}"""`,
                });
                return res.json({ summary: llmText, provider: 'llm', highlights: [] });
            } catch (e) {
                console.warn('LLM failed. fallback to rule:', e.message);
                // 폴백 아래로 계속 진행
            }
        }

        // fallback: rule
        const summary =
            `${name} 문진 요약: ${short}\n` +
            `- 증상 요약과 경과를 간단히 정리했습니다. 위급 징후 발견 시 담당자와 상의하세요.`;
        res.json({ summary, provider: 'rule', highlights: [] });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server_error' });
    }
});

/** -------------------------
 *  Lab/바이탈 요약 (룰 기반)
 *  ------------------------- */
app.post('/insight/lab-summary', async (req, res) => {
    try {
        const { observations = [] } = req.body ?? {};
        const flagged = observations
            .map(o => ({ ...o, flags: calcFlagsForObservation(o) }))
            .filter(o => o.flags.length > 0);

        let summary = '최근 관찰치 요약:';
        if (flagged.length === 0) {
            summary += ' 특이사항 없음.';
        } else {
            for (const f of flagged.slice(0, 5)) {
                summary += `\n- ${f.codeLoinc}=${f.value}${f.unit ? f.unit : ''} (${f.flags.join(',')})`;
            }
            summary += '\n주의: 수치가 임계 범위를 초과했습니다. 임상적 판단을 위해 추가 확인 필요.';
        }

        res.json({ summary, provider: 'rule', flaggedCount: flagged.length });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server_error' });
    }
});

app.listen(PORT, () => {
    console.log(`🧠 AI Gateway running http://localhost:${PORT}`);
});


app.listen(PORT, '127.0.0.1', () => {
    console.log(`🧠 AI Gateway running http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('AI Gateway listen error:', err)
});