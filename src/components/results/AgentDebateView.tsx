import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/Card'

interface DebateExchange {
  agent: 'buyer' | 'skeptic' | 'verdict'
  text: string
}

interface AgentDebateViewProps {
  exchanges?: DebateExchange[]
}

const agentStyles = {
  buyer: {
    label: 'Buyer Agent',
    color: '#C8FF00',
    bg: 'bg-amber/5',
    border: 'border-amber/20',
  },
  skeptic: {
    label: 'Skeptic Agent',
    color: '#D4645C',
    bg: 'bg-danger/5',
    border: 'border-danger/20',
  },
  verdict: {
    label: 'Final Verdict',
    color: '#5B9A6B',
    bg: 'bg-success/5',
    border: 'border-success/20',
  },
}

export function AgentDebateView({ exchanges }: AgentDebateViewProps) {
  if (!exchanges || exchanges.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <p className="text-sm text-text-muted">Debate loading...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold font-heading mb-4">Agent Debate</h3>
      <p className="text-xs text-text-muted mb-6">
        A Buyer Agent and Skeptic Agent debate your creative&apos;s strengths and weaknesses.
      </p>

      <div className="space-y-4">
        {exchanges.map((exchange, i) => {
          const style = agentStyles[exchange.agent]
          return (
            <div
              key={i}
              className={cn(
                'rounded-xl border p-4',
                style.bg,
                style.border
              )}
            >
              <span
                className="text-xs font-semibold mb-1.5 block"
                style={{ color: style.color }}
              >
                {style.label}
              </span>
              <p className="text-sm text-text-primary leading-relaxed">{exchange.text}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
