/**
 * AI Gateway 서버
 * 
 * 담당자: 김지현 (AI Gateway)
 * 
 * 주요 기능:
 * - 다중 AI 모델 통합 (OpenAI, Anthropic, Google)
 * - 자동 폴백 메커니즘 (모델 실패 시 자동 전환)
 * - Rate Limit 관리
 * - 임상노트 요약 (SOAP 분석)
 * - Lab/바이탈 요약
 * - 증상 분석 AI (진단 추천)
 * - 처방 가이드 (약물 상호작용 및 용량 가이드)
 * - 검사 결과 AI 분석
 * 
 * 기술 스택:
 * - Node.js + Express.js
 * - OpenAI API
 * - Anthropic Claude API
 * - Google Gemini API
 * - Rate Limit 관리
 * - CORS 설정
 * 
 * AI 모델:
 * - OpenAI: gpt-4o, gpt-4o-mini, gpt-3.5-turbo
 * - Anthropic: claude-3-5-sonnet, claude-3-haiku, claude-3-opus
 * - Google: gemini-1.5-pro, gemini-1.5-flash, gemini-1.0-pro
 * 
 * API 엔드포인트:
 * - /health - 헬스체크
 * - /insight/clinical-note - 임상노트 요약
 * - /insight/lab-summary - Lab 요약
 * - /insight/symptom-analysis - 증상 분석
 * - /insight/prescription-guide - 처방 가이드
 * - /insight/test-analysis - 검사 결과 분석
 * - /models/status - 모델 상태 확인
 */
// ai-gateway/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
    credentials: true
}));
app.use(express.json());

const PORT = Number(process.env.PORT ?? 5001);

// Rate limit 관리
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX_REQUESTS = 30; // 1분당 최대 30개 요청 (증가)

// Rate limit 체크 함수
function checkRateLimit(provider) {
    const now = Date.now();
    const key = `${provider}_${Math.floor(now / RATE_LIMIT_WINDOW)}`;
    
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, 0);
    }
    
    const currentCount = rateLimitMap.get(key);
    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    
    rateLimitMap.set(key, currentCount + 1);
    return true;
}

// Rate limit 대기 함수
function waitForRateLimit(provider) {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            if (checkRateLimit(provider)) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 1000); // 1초마다 체크
    });
}

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

        // Rate limit 체크
        if (!checkRateLimit(providerName)) {
            console.warn(`Rate limit exceeded for ${providerName}, waiting...`);
            await waitForRateLimit(providerName);
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
            const errorMessage = error.message || 'Unknown error';
            const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('429') || errorMessage.includes('Rate limit reached');
            const isAuthError = errorMessage.includes('401') || errorMessage.includes('unauthorized');
            
            if (isRateLimit) {
                console.warn(`❌ ${config.name} rate limit exceeded, waiting...`);
                await waitForRateLimit(providerName);
                continue; // 재시도
            } else if (isAuthError) {
                console.error(`❌ ${config.name} authentication failed:`, errorMessage);
                continue; // 다른 프로바이더로 넘어감
            } else {
                console.warn(`❌ ${config.name} failed:`, errorMessage);
            }
            
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
                const systemPrompt = '당신은 경험 많은 의사입니다. SOAP 진료 기록을 분석하여 간결하고 정확한 의학적 인사이트를 제공하세요. 의학적 단정은 피하고, 구체적이고 실행 가능한 권고사항을 제시하세요.';
                const userPrompt = `다음 SOAP 진료 기록을 분석하여 의학적 인사이트를 제공해주세요.

환자 정보: ${name} ${patient?.age ? `${patient.age}세` : ''} ${patient?.sex || ''}
SOAP 기록: """${short}"""

다음 형식으로 답변해주세요:

환자: ${name} (${patient?.age || ''}세, ${patient?.sex || ''})

핵심 요약:
• [주요 증상만 간단히]
• [기존 질환만 간단히]

추천 처방:
• [구체적인 약물명] [용량] ([복용법])
• [구체적인 약물명] [용량] ([복용법])

추천 검사:
• [구체적인 검사명]
• [구체적인 검사명]

위 형식 외의 다른 내용은 절대 추가하지 마세요.`;

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

        // fallback: rule (구조화된 형식)
        // SOAP 내용에 따라 동적으로 추천 생성
        let symptoms = [];
        let prescriptions = [];
        let tests = [];
        
        // 증상 추출
        if (short.includes('두통') || short.includes('어지럼증') || short.includes('구토')) {
            symptoms.push('두통, 어지럼증, 구토');
            prescriptions.push('아세트아미노펜 500mg (1T tid)');
            prescriptions.push('이부프로펜 400mg (1T bid)');
            tests.push('뇌CT');
            tests.push('혈액검사 (CBC, CRP)');
        } else if (short.includes('복통') || short.includes('복부')) {
            symptoms.push('복통');
            prescriptions.push('제산제 (1T tid)');
            prescriptions.push('진경제 (1T bid)');
            tests.push('복부초음파');
            tests.push('혈액검사 (CBC, CRP)');
        } else if (short.includes('감기') || short.includes('기침') || short.includes('콧물')) {
            symptoms.push('감기 증상');
            prescriptions.push('해열진통제 (1T tid)');
            prescriptions.push('기침약 (1T tid)');
            tests.push('혈액검사 (CBC)');
        } else {
            symptoms.push('일반 증상');
            prescriptions.push('진통제 (1T tid)');
            tests.push('혈액검사 (CBC)');
        }
        
        const summary = `환자: ${name} (${patient?.age || ''}세, ${patient?.sex || ''})
핵심 요약: ${symptoms.join(', ')}
추천 처방: ${prescriptions.join(', ')}
추천 검사: ${tests.join(', ')}`;
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
한국어로 응답하고, 다음 형식을 정확히 따라주세요:

## 1. 주요 증상 요약
- 환자의 주요 증상을 간단히 요약

## 2. 가능한 진단 (확률 순)
각 진단에 대해 다음 형식으로 제시:
- **진단명**: 확률 (예: 70%)
- 간단한 설명

## 3. 추가 검사 권장사항
- 필요한 검사 목록
- 각 검사의 목적

## 4. 주의사항
- 응급상황 징후
- 즉시 의료진 상담이 필요한 경우
- 일반적인 주의사항

⚠️ 중요: 모든 진단은 참고용이며, 최종 진단은 의료진이 판단해야 합니다.`;

                const userPrompt = `환자 정보:
- 이름: ${name} ${age ? `${age}세` : ''} ${sex || ''}
- 증상: ${symptoms.join(', ')}
- 관찰치: ${observations.map(o => `${o.codeLoinc}=${o.value}${o.unit || ''}`).join(', ')}

위 정보를 바탕으로 체계적인 진단 추천을 해주세요.`;

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
한국어로 응답하고, 다음 형식을 정확히 따라주세요:

## 1. 약물 상호작용 분석
- 처방 약물 간 상호작용
- 기존 약물과의 상호작용
- 위험도 수준 (낮음/보통/높음)

## 2. 용량 가이드
- 각 약물의 권장 용량
- 환자 특성 고려사항 (나이, 체중 등)
- 복용법 및 시기

## 3. 주의사항
- 부작용 모니터링
- 금기사항
- 특별 주의가 필요한 경우

## 4. 모니터링 권장사항
- 정기 검사 항목
- 부작용 징후
- 추적 관찰 사항

⚠️ 중요: 모든 가이드는 참고용이며, 최종 처방은 의료진이 판단해야 합니다.`;

                const userPrompt = `환자 정보:
- 이름: ${name} ${age ? `${age}세` : ''} ${weight ? `${weight}kg` : ''}
- 처방 약물: ${medications.join(', ')}
- 현재 복용 중인 약물: ${currentMedications.join(', ')}

약물 상호작용과 용량 가이드를 체계적으로 제공해주세요.`;

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
 *  검사 결과 AI 분석
 *  ------------------------- */
app.post('/insight/test-analysis', async (req, res) => {
    try {
        const provider = (req.query.provider || 'auto').toLowerCase();
        const { testResult = {}, patient = {} } = req.body ?? {};
        const name = patient?.name ?? '환자';
        
        // AI 모델 사용 시도
        if (provider !== 'rule') {
            try {
                const systemPrompt = '당신은 경험 많은 검사실 의사입니다. 검사 결과를 분석하여 의학적으로 정확하고 이해하기 쉬운 해석을 제공하세요.';
                const userPrompt = `다음 검사 결과를 분석해주세요.

환자: ${name} (${patient?.age || ''}세, ${patient?.sex || ''})
검사명: ${testResult.testName || '검사'}
결과값: ${testResult.value || ''} ${testResult.unit || ''}
정상범위: ${testResult.referenceRange || ''}
결과상태: ${testResult.status || ''}

다음 형식으로 분석해주세요:

검사 결과 분석:
• [결과 해석]
• [임상적 의미]
• [추가 검사 권고사항]
• [주의사항]`;

                const aiResult = await callLLM({ system: systemPrompt, prompt: userPrompt, provider });
                
                res.json({ 
                    analysis: aiResult.result, 
                    provider: aiResult.provider, 
                    model: aiResult.model
                });
                return;
            } catch (e) {
                console.warn('AI models failed. fallback to rule:', e.message);
            }
        }

        // fallback: rule 기반 분석
        const { testName, value, unit, status, referenceRange } = testResult;
        
        let analysis = `검사 결과 분석:\n`;
        
        if (status === 'critical') {
            analysis += `• ⚠️ 위험: ${testName} 결과가 위험 수준입니다.\n`;
            analysis += `• 즉시 의료진 확인이 필요합니다.\n`;
            analysis += `• 추가 검사나 응급 처치를 고려해보세요.\n`;
            analysis += `• 환자 상태를 면밀히 모니터링하세요.`;
        } else if (status === 'abnormal') {
            analysis += `• ⚠️ 주의: ${testName} 결과가 정상 범위를 벗어났습니다.\n`;
            analysis += `• 임상적 의미를 고려하여 추가 검사를 권고합니다.\n`;
            analysis += `• 환자 증상과 함께 종합적으로 판단하세요.\n`;
            analysis += `• 추후 재검사를 통해 변화를 관찰하세요.`;
        } else {
            analysis += `• ✅ 정상: ${testName} 결과가 정상 범위 내에 있습니다.\n`;
            analysis += `• 특이사항이 없으며 현재 상태는 양호합니다.\n`;
            analysis += `• 정기적인 검사를 통해 지속적으로 모니터링하세요.\n`;
            analysis += `• 환자에게 안심시켜 드리세요.`;
        }

        res.json({ 
            analysis, 
            provider: 'rule'
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