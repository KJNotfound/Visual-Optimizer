import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { BatteryInputs, BatteryResult } from '@/lib/battery-calculator'
import { calculateBattery } from '@/lib/battery-calculator'
import { BatteryResultView } from '@/components/BatteryResult'
import {
  Zap,
  Moon,
  Briefcase,
  Dumbbell,
  Users,
  Salad,
  Brain,
  Monitor,
  Wallet,
  ChevronDown,
} from 'lucide-react'

interface SelectOption {
  value: number | boolean
  label: string
}

interface QuestionConfig {
  key: keyof BatteryInputs
  label: string
  icon: React.ElementType
  iconColor: string
  type: 'slider' | 'select' | 'toggle'
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
  tooltip?: string
}

const questions: QuestionConfig[] = [
  {
    key: 'age',
    label: '你的年龄',
    icon: Zap,
    iconColor: 'text-amber-400',
    type: 'slider',
    min: 18,
    max: 65,
    step: 1,
    unit: '岁',
  },
  {
    key: 'sleepHours',
    label: '每天睡几个小时',
    icon: Moon,
    iconColor: 'text-indigo-400',
    type: 'slider',
    min: 3,
    max: 12,
    step: 0.5,
    unit: '小时',
  },
  {
    key: 'workHoursPerDay',
    label: '每天工作时长',
    icon: Briefcase,
    iconColor: 'text-blue-400',
    type: 'slider',
    min: 4,
    max: 16,
    step: 0.5,
    unit: '小时',
    tooltip: '含加班时间',
  },
  {
    key: 'commuteMinutes',
    label: '每天通勤时间(单程)',
    icon: Briefcase,
    iconColor: 'text-sky-400',
    type: 'slider',
    min: 0,
    max: 180,
    step: 10,
    unit: '分钟',
  },
  {
    key: 'exerciseFreq',
    label: '每周运动几天',
    icon: Dumbbell,
    iconColor: 'text-green-400',
    type: 'slider',
    min: 0,
    max: 7,
    step: 1,
    unit: '天',
  },
  {
    key: 'screenHoursAfterWork',
    label: '下班后刷屏时间',
    icon: Monitor,
    iconColor: 'text-purple-400',
    type: 'slider',
    min: 0,
    max: 8,
    step: 0.5,
    unit: '小时',
  },
  {
    key: 'socialFreq',
    label: '社交频率',
    icon: Users,
    iconColor: 'text-pink-400',
    type: 'select',
    options: [
      { value: 0, label: '几乎没有' },
      { value: 1, label: '偶尔社交' },
      { value: 2, label: '经常社交' },
      { value: 3, label: '社牛本牛' },
    ],
  },
  {
    key: 'relationship',
    label: '感情状态',
    icon: Users,
    iconColor: 'text-rose-400',
    type: 'select',
    options: [
      { value: 0, label: '单身且享受' },
      { value: 1, label: '单身想脱单' },
      { value: 2, label: '有伴侣/已婚' },
      { value: 3, label: '甜蜜暴击中' },
    ],
  },
  {
    key: 'diet',
    label: '饮食习惯',
    icon: Salad,
    iconColor: 'text-lime-400',
    type: 'select',
    options: [
      { value: 0, label: '外卖续命' },
      { value: 1, label: '有时自己做' },
      { value: 2, label: '经常自己做' },
      { value: 3, label: '养生达人' },
    ],
  },
  {
    key: 'drinkWater',
    label: '每天喝水量',
    icon: Salad,
    iconColor: 'text-cyan-400',
    type: 'select',
    options: [
      { value: 0, label: '不到1L' },
      { value: 1, label: '1-2L' },
      { value: 2, label: '2-3L' },
      { value: 3, label: '3L以上' },
    ],
  },
  {
    key: 'caffeine',
    label: '咖啡/茶摄入',
    icon: Salad,
    iconColor: 'text-amber-600',
    type: 'select',
    options: [
      { value: 0, label: '完全不喝' },
      { value: 1, label: '偶尔来一杯' },
      { value: 2, label: '每天1-2杯' },
      { value: 3, label: '续命级选手' },
    ],
  },
  {
    key: 'mentalHealth',
    label: '心理状态',
    icon: Brain,
    iconColor: 'text-violet-400',
    type: 'select',
    options: [
      { value: 0, label: '经常焦虑/抑郁' },
      { value: 1, label: '偶尔emo' },
      { value: 2, label: '比较平和' },
      { value: 3, label: '心态稳如老狗' },
    ],
  },
  {
    key: 'jobSatisfaction',
    label: '工作满意度',
    icon: Briefcase,
    iconColor: 'text-teal-400',
    type: 'select',
    options: [
      { value: 0, label: '每天想跑路' },
      { value: 1, label: '勉强将就' },
      { value: 2, label: '还过得去' },
      { value: 3, label: '热爱工作' },
    ],
  },
  {
    key: 'hobby',
    label: '兴趣爱好',
    icon: Zap,
    iconColor: 'text-orange-400',
    type: 'select',
    options: [
      { value: 0, label: '没有爱好' },
      { value: 1, label: '有但没时间' },
      { value: 2, label: '偶尔做做' },
      { value: 3, label: '经常沉浸其中' },
    ],
  },
  {
    key: 'savings',
    label: '财务状况',
    icon: Wallet,
    iconColor: 'text-emerald-400',
    type: 'select',
    options: [
      { value: 0, label: '月光/负债' },
      { value: 1, label: '略有结余' },
      { value: 2, label: '有一定存款' },
      { value: 3, label: '财务自由' },
    ],
  },
  {
    key: 'livingAlone',
    label: '是否独居',
    icon: Users,
    iconColor: 'text-slate-400',
    type: 'toggle',
    options: [
      { value: false, label: '和人同住' },
      { value: true, label: '独居' },
    ],
  },
  {
    key: 'hasPets',
    label: '是否养宠物',
    icon: Zap,
    iconColor: 'text-yellow-400',
    type: 'toggle',
    options: [
      { value: false, label: '没有' },
      { value: true, label: '有毛孩子' },
    ],
  },
]

const defaultInputs: BatteryInputs = {
  age: 25,
  sleepHours: 7,
  exerciseFreq: 2,
  workHoursPerDay: 9,
  commuteMinutes: 60,
  screenHoursAfterWork: 3,
  socialFreq: 1,
  diet: 1,
  hobby: 1,
  relationship: 1,
  savings: 1,
  mentalHealth: 1,
  jobSatisfaction: 1,
  livingAlone: false,
  hasPets: false,
  drinkWater: 1,
  caffeine: 1,
}

function SliderInput({
  config,
  value,
  onChange,
}: {
  config: QuestionConfig
  value: number
  onChange: (v: number) => void
}) {
  const min = config.min ?? 0
  const max = config.max ?? 100
  const step = config.step ?? 1
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {config.tooltip && <span className="text-xs opacity-60">({config.tooltip}) </span>}
        </span>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {value}{config.unit}
        </span>
      </div>
      <div className="relative">
        <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-muted/80" />
        <div
          className="absolute h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/80 to-primary"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="relative w-full appearance-none bg-transparent cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
        />
      </div>
    </div>
  )
}

function SelectInput({
  config,
  value,
  onChange,
}: {
  config: QuestionConfig
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none rounded-lg border border-border bg-secondary/50 px-4 py-2.5 pr-10
          text-foreground text-sm font-medium cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
          transition-colors"
      >
        {config.options?.map((opt) => (
          <option key={String(opt.value)} value={Number(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}

function ToggleInput({
  config,
  value,
  onChange,
}: {
  config: QuestionConfig
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex gap-2">
      {config.options?.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value as boolean)}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all cursor-pointer
            ${value === opt.value
              ? 'bg-primary/20 text-primary border border-primary/50 shadow-sm'
              : 'bg-secondary/50 text-muted-foreground border border-border hover:bg-secondary'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function QuestionCard({
  config,
  value,
  onChange,
}: {
  config: QuestionConfig
  value: number | boolean
  onChange: (key: keyof BatteryInputs, val: number | boolean) => void
}) {
  const Icon = config.icon
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-card/80">
          <Icon className={`h-4 w-4 ${config.iconColor}`} />
        </div>
        <label className="text-sm font-semibold text-foreground">{config.label}</label>
      </div>
      {config.type === 'slider' && (
        <SliderInput
          config={config}
          value={value as number}
          onChange={(v) => onChange(config.key, v)}
        />
      )}
      {config.type === 'select' && (
        <SelectInput
          config={config}
          value={value as number}
          onChange={(v) => onChange(config.key, v)}
        />
      )}
      {config.type === 'toggle' && (
        <ToggleInput
          config={config}
          value={value as boolean}
          onChange={(v) => onChange(config.key, v)}
        />
      )}
    </div>
  )
}

export function CalculatorPage() {
  const [inputs, setInputs] = useState<BatteryInputs>(defaultInputs)
  const [result, setResult] = useState<BatteryResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleChange = useCallback((key: keyof BatteryInputs, val: number | boolean) => {
    setInputs((prev) => ({ ...prev, [key]: val }))
  }, [])

  const handleCalculate = useCallback(() => {
    const res = calculateBattery(inputs)
    setResult(res)
    setShowResult(true)
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [inputs])

  const handleReset = useCallback(() => {
    setShowResult(false)
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/60 backdrop-blur-xl sticky top-0 z-50 bg-background/70">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-base font-bold tracking-tight">人生电量计算器</span>
          </div>
          <span className="text-xs text-muted-foreground">v1.0.0</span>
        </div>
      </header>

      <main className="flex-1 pb-12">
        <section className="pt-10 pb-6 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🔋</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              你的人生还剩多少
              <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 bg-clip-text text-transparent">
                电量
              </span>
              ？
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              回答下面的问题，测算你当前的生活能量值。
              <br />
              纯属娱乐，但也许能让你重新审视生活。
            </p>
          </div>
        </section>

        <section className="px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6 space-y-6">
                {questions.map((q) => (
                  <QuestionCard
                    key={q.key}
                    config={q}
                    value={inputs[q.key]}
                    onChange={handleChange}
                  />
                ))}

                <div className="pt-4">
                  <Button
                    onClick={handleCalculate}
                    size="lg"
                    className="w-full text-base gap-2 h-12"
                  >
                    <Zap className="h-5 w-5" />
                    测算我的电量
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {showResult && result && (
          <section id="result-section" className="px-4 mt-8">
            <div className="max-w-2xl mx-auto">
              <BatteryResultView result={result} onReset={handleReset} />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border/50 py-6 px-4">
        <div className="max-w-2xl mx-auto text-center text-xs text-muted-foreground">
          人生电量计算器 &copy; {new Date().getFullYear()} &middot; 纯属娱乐，认真你就充电了
        </div>
      </footer>
    </div>
  )
}
