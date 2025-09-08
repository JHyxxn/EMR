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
 *  공통: 다중 AI 모델 지원 LLM 호출 함수
 *  ------------------------- */

// AI 모델 설정
const AI_MODELS = {
    openai: {
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4o-mini',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
    },
    anthropic: {
        name: 'Anthropic Claude',
        baseUrl: 'https://api.anthropic.com/v1/messages',
        apiKey: process.env.ANTHROPIC_API_KEY,
        defaultModel: 'claude-3-haiku-20240307',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229']
    },
    google: {
        name: 'Google Gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
        apiKey: process.env.GOOGLE_API_KEY,
        defaultModel: 'gemini-1.5-flash',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro']
    }
};

// OpenAI 호출 함수
async function callOpenAI({ system, prompt, model = AI_MODELS.openai.defaultModel }) {
    const r = await fetch(AI_MODELS.openai.baseUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AI_MODELS.openai.apiKey}`,
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
    if (!r.ok) throw new Error(data?.error?.message || 'OpenAI_ERROR');
    return data.choices?.[0]?.message?.content ?? '';
}

// Anthropic Claude 호출 함수
async function callAnthropic({ system, prompt, model = AI_MODELS.anthropic.defaultModel }) {
    const r = await fetch(AI_MODELS.anthropic.baseUrl, {
        method: 'POST',
        headers: {
            'x-api-key': AI_MODELS.anthropic.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model,
            max_tokens: 1000,
            messages: [
                { role: 'user', content: `${system}\n\n${prompt}` }
            ]
        })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || 'Anthropic_ERROR');
    return data.content?.[0]?.text ?? '';
}

// Google Gemini 호출 함수
async function callGoogle({ system, prompt, model = AI_MODELS.google.defaultModel }) {
    const url = `${AI_MODELS.google.baseUrl}/${model}:generateContent?key=${AI_MODELS.google.apiKey}`;
    
    const r = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${system}\n\n${prompt}`
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1000
            }
        })
    });

    const data = await r.json();
    if (!r.ok) throw new Error(data?.error?.message || 'Google_ERROR');
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// 통합 LLM 호출 함수 (자동 폴백 지원)
async function callLLM({ system, prompt, provider = 'auto', model = null }) {
    const providers = provider === 'auto' 
        ? ['openai', 'anthropic', 'google'] 
        : [provider];

    let lastError = null;

    for (const providerName of providers) {
        const config = AI_MODELS[providerName];
        if (!config || !config.apiKey) {
            console.warn(`Provider ${providerName} not configured, skipping...`);
            continue;
        }

        try {
            const selectedModel = model || config.defaultModel;
            console.log(`Trying ${config.name} with model ${selectedModel}...`);

            let result;
            switch (providerName) {
                case 'openai':
                    result = await callOpenAI({ system, prompt, model: selectedModel });
                    break;
                case 'anthropic':
                    result = await callAnthropic({ system, prompt, model: selectedModel });
                    break;
                case 'google':
                    result = await callGoogle({ system, prompt, model: selectedModel });
                    break;
                default:
                    throw new Error(`Unsupported provider: ${providerName}`);
            }

            console.log(`✅ Success with ${config.name}`);
            return { result, provider: providerName, model: selectedModel };
        } catch (error) {
            console.warn(`❌ ${config.name} failed:`, error.message);
            lastError = error;
            continue;
        }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
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
 *  - ?provider=rule | auto | openai | anthropic | google
 *  - auto: 자동 폴백 (openai -> anthropic -> google -> rule)
 *  ------------------------- */
app.post('/insight/clinical-note', async (req, res) => {
    try {
        const provider = (req.query.provider || 'auto').toLowerCase();
        const { text = '', patient = {} } = req.body ?? {};
        const name = patient?.name ?? '환자';
        const short = text.length > 400 ? text.slice(0, 400) + '…' : text;

        // AI 모델 사용 시도
        if (provider !== 'rule') {
            try {
                const systemPrompt = '의학적 단정 금지. 관찰 기반으로 2~4문장 요약. 한국어.';
                const userPrompt = `다음 문진 내용을 2~3문장으로 요약하고, 위험 신호가 있으면 마지막에 한 문장으로 조심스럽게 제안해줘.
- 환자: ${name} ${patient?.age ? `${patient.age}세` : ''} ${patient?.sex || ''}
- 문진: """${short}"""`;

                const aiResult = await callLLM({
                    system: systemPrompt,
                    prompt: userPrompt,
                    provider: provider === 'auto' ? 'auto' : provider
                });

                return res.json({ 
                    summary: aiResult.result, 
                    provider: aiResult.provider, 
                    model: aiResult.model,
                    highlights: [] 
                });
            } catch (e) {
                console.warn('AI models failed. fallback to rule:', e.message);
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

/** -------------------------
 *  증상 분석 AI (환자 증상 기반 진단 추천)
 *  - ?provider=auto | openai | anthropic | google
 *  ------------------------- */
app.post('/insight/symptom-analysis', async (req, res) => {
    try {
        const provider = (req.query.provider || 'auto').toLowerCase();
        const { symptoms = [], patient = {}, observations = [] } = req.body ?? {};
        const name = patient?.name ?? '환자';
        const age = patient?.age;
        const sex = patient?.sex;

        // AI 모델 사용 시도
        if (provider !== 'rule') {
            try {
                const systemPrompt = `당신은 경험 많은 의료진입니다. 환자의 증상과 관찰치를 바탕으로 가능한 진단을 추천하되, 의학적 단정은 금지합니다. 
한국어로 응답하고, 다음 형식을 따라주세요:
1. 주요 증상 요약
2. 가능한 진단 (확률 순)
3. 추가 검사 권장사항
4. 주의사항`;

                const userPrompt = `환자 정보:
- 이름: ${name} ${age ? `${age}세` : ''} ${sex || ''}
- 증상: ${symptoms.join(', ')}
- 관찰치: ${observations.map(o => `${o.codeLoinc}=${o.value}${o.unit || ''}`).join(', ')}

위 정보를 바탕으로 진단 추천을 해주세요.`;

                const aiResult = await callLLM({
                    system: systemPrompt,
                    prompt: userPrompt,
                    provider: provider === 'auto' ? 'auto' : provider
                });

                return res.json({ 
                    analysis: aiResult.result, 
                    provider: aiResult.provider, 
                    model: aiResult.model,
                    symptoms: symptoms,
                    observations: observations
                });
            } catch (e) {
                console.warn('AI models failed. fallback to rule:', e.message);
                // 폴백 아래로 계속 진행
            }
        }

        // fallback: rule
        const analysis = `${name} 증상 분석:
- 주요 증상: ${symptoms.join(', ')}
- 관찰치: ${observations.length}개 항목 확인
- 권장사항: 정확한 진단을 위해 추가 검사 및 전문의 상담 필요
- 주의: AI 분석은 참고용이며, 최종 진단은 의료진이 판단해야 합니다.`;

        res.json({ 
            analysis, 
            provider: 'rule', 
            symptoms: symptoms,
            observations: observations
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server_error' });
    }
});

/** -------------------------
 *  처방 가이드 (약물 상호작용 및 용량 가이드)
 *  - ?provider=auto | openai | anthropic | google
 *  ------------------------- */
app.post('/insight/prescription-guide', async (req, res) => {
    try {
        const provider = (req.query.provider || 'auto').toLowerCase();
        const { medications = [], patient = {}, currentMedications = [] } = req.body ?? {};
        const name = patient?.name ?? '환자';
        const age = patient?.age;
        const weight = patient?.weight;

        // AI 모델 사용 시도
        if (provider !== 'rule') {
            try {
                const systemPrompt = `당신은 임상약사입니다. 환자의 약물 처방에 대한 상호작용과 용량 가이드를 제공하되, 의학적 단정은 금지합니다.
한국어로 응답하고, 다음 형식을 따라주세요:
1. 약물 상호작용 분석
2. 용량 가이드
3. 주의사항
4. 모니터링 권장사항`;

                const userPrompt = `환자 정보:
- 이름: ${name} ${age ? `${age}세` : ''} ${weight ? `${weight}kg` : ''}
- 처방 약물: ${medications.join(', ')}
- 현재 복용 중인 약물: ${currentMedications.join(', ')}

약물 상호작용과 용량 가이드를 제공해주세요.`;

                const aiResult = await callLLM({
                    system: systemPrompt,
                    prompt: userPrompt,
                    provider: provider === 'auto' ? 'auto' : provider
                });

                return res.json({ 
                    guide: aiResult.result, 
                    provider: aiResult.provider, 
                    model: aiResult.model,
                    medications: medications,
                    currentMedications: currentMedications
                });
            } catch (e) {
                console.warn('AI models failed. fallback to rule:', e.message);
                // 폴백 아래로 계속 진행
            }
        }

        // fallback: rule
        const guide = `${name} 처방 가이드:
- 처방 약물: ${medications.join(', ')}
- 현재 복용 약물: ${currentMedications.join(', ')}
- 권장사항: 약물 상호작용 확인을 위해 약사 상담 필요
- 주의: AI 가이드는 참고용이며, 최종 처방은 의료진이 판단해야 합니다.`;

        res.json({ 
            guide, 
            provider: 'rule', 
            medications: medications,
            currentMedications: currentMedications
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server_error' });
    }
});

/** -------------------------
 *  AI 모델 상태 확인
 *  ------------------------- */
app.get('/models/status', async (_req, res) => {
    try {
        const status = {};
        
        for (const [provider, config] of Object.entries(AI_MODELS)) {
            status[provider] = {
                name: config.name,
                configured: !!config.apiKey,
                models: config.models,
                defaultModel: config.defaultModel
            };
        }

        res.json({ 
            providers: status,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server_error' });
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🧠 AI Gateway running http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('AI Gateway listen error:', err)
});