import type { BatteryResult } from '@/lib/battery-calculator'
import { getBatteryColor, getBatteryGradient } from '@/lib/battery-calculator'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

function BatteryIcon({ percentage, color }: { percentage: number; color: string }) {
  const [animatedPct, setAnimatedPct] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 150)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="flex items-center justify-center">
      <svg width="160" height="280" viewBox="0 0 160 280">
        {/* Battery cap */}
        <rect x="50" y="4" width="60" height="20" rx="6" fill="currentColor" className="text-muted-foreground/40" />
        {/* Battery body outline */}
        <rect x="20" y="24" width="120" height="240" rx="16" fill="none" stroke="currentColor"
          strokeWidth="4" className="text-muted-foreground/30" />
        {/* Battery fill */}
        <defs>
          <clipPath id="battery-clip">
            <rect x="26" y="30" width="108" height="228" rx="12" />
          </clipPath>
        </defs>
        <rect
          x="26"
          y={30 + 228 * (1 - animatedPct / 100)}
          width="108"
          height={228 * (animatedPct / 100)}
          rx="12"
          fill={color}
          clipPath="url(#battery-clip)"
          style={{ transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          opacity="0.9"
        />
        {/* Shine effect */}
        <rect
          x="34"
          y={38 + 228 * (1 - animatedPct / 100)}
          width="16"
          height={Math.max(0, 228 * (animatedPct / 100) - 16)}
          rx="8"
          fill="white"
          opacity="0.15"
          clipPath="url(#battery-clip)"
          style={{ transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        {/* Percentage text */}
        <text x="80" y="155" textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize="36" fontWeight="bold" fontFamily="system-ui">
          {animatedPct}%
        </text>
      </svg>
    </div>
  )
}

function BreakdownBar({
  label,
  score,
  maxScore,
  emoji,
  comment,
  delay,
}: {
  label: string
  score: number
  maxScore: number
  emoji: string
  comment: string
  delay: number
}) {
  const [show, setShow] = useState(false)
  const pct = (score / maxScore) * 100

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className="space-y-1.5 transition-all duration-500"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <span>{emoji}</span>
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-muted-foreground tabular-nums">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2.5 bg-muted/80 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: show ? `${pct}%` : '0%',
            backgroundColor:
              pct >= 75 ? '#22c55e' :
              pct >= 50 ? '#eab308' :
              pct >= 30 ? '#f97316' :
              '#ef4444',
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{comment}</p>
    </div>
  )
}

export function BatteryResultView({
  result,
  onReset,
}: {
  result: BatteryResult
  onReset: () => void
}) {
  const color = getBatteryColor(result.level)
  const gradient = getBatteryGradient(result.level)

  const handleShare = async () => {
    const text = `🔋 我的人生电量：${result.totalBattery}%「${result.title}」\n${result.breakdown.map(b => `${b.emoji} ${b.label}: ${b.score}/${b.maxScore}`).join('\n')}\n\n来测测你的 👉 人生电量计算器`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: '人生电量计算器', text })
      } catch {
        await navigator.clipboard.writeText(text)
      }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className={`bg-gradient-to-br ${gradient} p-8 text-center`}>
        <BatteryIcon percentage={result.totalBattery} color={color} />
        <h2 className="text-2xl font-bold text-white mt-4">{result.title}</h2>
        <p className="text-white/80 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
          {result.description}
        </p>
      </div>

      <CardContent className="p-5 sm:p-6 space-y-5">
        <h3 className="text-base font-semibold text-foreground">电量分析</h3>
        <div className="space-y-4">
          {result.breakdown.map((b, i) => (
            <BreakdownBar
              key={b.category}
              label={b.label}
              score={b.score}
              maxScore={b.maxScore}
              emoji={b.emoji}
              comment={b.comment}
              delay={300 + i * 100}
            />
          ))}
        </div>

        <div className="pt-4 flex gap-3">
          <Button onClick={onReset} variant="outline" className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" />
            重新测算
          </Button>
          <Button onClick={handleShare} className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            分享结果
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
