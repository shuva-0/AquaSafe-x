import { NextRequest, NextResponse } from 'next/server'
import { AnalysisResult } from '@/lib/types'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  context?: AnalysisResult
  history?: ChatMessage[]
}

// Rule-based assistant when no AI API configured
function ruleBasedResponse(message: string, context?: AnalysisResult): string {
  const msg = message.toLowerCase()

  if (context) {
    if (msg.includes('safe') || msg.includes('drink')) {
      return context.status === 'Safe'
        ? `Based on the analysis, this water is classified as **Safe** with a score of ${context.score}/100 (WQI: ${context.wqi}). The confidence in this assessment is ${context.confidence}%. ${context.health.riskLevel === 'Low' ? 'Health risk is low.' : `Health risk is ${context.health.riskLevel} — take precautions.`}`
        : `This water is classified as **Unsafe** with a score of ${context.score}/100. Do NOT drink this water. ${context.issues[0] ?? ''}`
    }

    if (msg.includes('issue') || msg.includes('problem') || msg.includes('wrong')) {
      if (context.issues.length === 0) return 'No critical parameter violations detected. Water quality is within acceptable ranges.'
      return `The main issues are:\n${context.issues.map((i, n) => `${n + 1}. ${i}`).join('\n')}`
    }

    if (msg.includes('recommend') || msg.includes('do') || msg.includes('action')) {
      const recs = context.recommendations.immediate.slice(0, 3)
      return `Immediate recommendations:\n${recs.join('\n')}\n\nFor full recommendations, view the analysis results.`
    }

    if (msg.includes('health') || msg.includes('disease') || msg.includes('risk')) {
      if (context.health.diseases.length === 0) return `Health risk level is ${context.health.riskLevel}. No specific disease risks identified.`
      return `Health risk: **${context.health.riskLevel}**\n\nPotential risks:\n${context.health.diseases.slice(0, 3).map((d, i) => `${i + 1}. ${d}`).join('\n')}`
    }

    if (msg.includes('predict') || msg.includes('forecast') || msg.includes('trend') || msg.includes('future')) {
      return `**Trend:** ${context.prediction.trend}\n\n${context.prediction.forecast}`
    }

    if (msg.includes('score') || msg.includes('wqi') || msg.includes('index')) {
      return `**Water Quality Index (WQI):** ${context.wqi}\n**Score:** ${context.score}/100\n**Status:** ${context.status}\n\nWQI closer to 0 means better water quality. A score above 50 indicates safe water.`
    }

    if (msg.includes('confidence')) {
      return `The analysis confidence is **${context.confidence}%**. ${context.confidence < 80 ? 'Some parameters were missing or at extreme values, which reduces accuracy. Consider providing dissolved oxygen and conductivity readings.' : 'High confidence — all key parameters were provided.'}`
    }
  }

  // General water quality knowledge
  if (msg.includes('ph')) {
    return 'pH measures water acidity/alkalinity on a scale of 0–14. Safe drinking water should be between 6.5–8.5. pH < 6.5 can cause corrosion and irritation; pH > 8.5 can cause scaling and digestive issues.'
  }

  if (msg.includes('tds') || msg.includes('dissolved solid')) {
    return 'Total Dissolved Solids (TDS) measures the concentration of dissolved minerals, salts, and metals. WHO safe limit is 500 mg/L. High TDS can affect taste and cause kidney stress over time.'
  }

  if (msg.includes('turbidity')) {
    return 'Turbidity measures water cloudiness caused by suspended particles. Safe limit is 4 NTU (WHO). High turbidity indicates contamination and can shield pathogens from disinfection.'
  }

  if (msg.includes('oxygen') || msg.includes('do ')) {
    return 'Dissolved Oxygen (DO) indicates how much oxygen is dissolved in water. Safe range is 6–14 mg/L. Low DO can indicate organic pollution and creates conditions favorable for harmful bacteria.'
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('help')) {
    return 'Hello! I\'m the AquaSafe assistant. I can help you understand water quality analysis results, explain parameters, or provide guidance on water safety. Run an analysis first for context-specific answers!'
  }

  return 'I\'m here to help interpret water quality data. Try asking about specific parameters (pH, TDS, turbidity), health risks, or recommendations. For best results, run a water quality analysis first!'
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ChatRequest = await request.json()
    const { message, context, history } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY

    if (anthropicKey) {
      // Use Claude API if key is provided
      const systemPrompt = `You are AquaSafe Assistant, an expert in water quality analysis and public health. 
      You help users understand their water quality results and provide actionable guidance.
      Be concise, professional, and actionable. Use markdown for formatting.
      ${context ? `Current analysis context: ${JSON.stringify(context, null, 2)}` : ''}`

      const messages = [
        ...(history ?? []),
        { role: 'user', content: message }
      ]

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          system: systemPrompt,
          messages,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data.content?.[0]?.text ?? 'No response generated.'
        return NextResponse.json({ reply, history: [...messages, { role: 'assistant', content: reply }] })
      }
    }

    // Fallback to rule-based response
    const reply = ruleBasedResponse(message, context)
    return NextResponse.json({
      reply,
      history: [
        ...(history ?? []),
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ],
    })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}