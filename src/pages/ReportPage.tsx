import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAnalysisStore } from '@/store/analysis-store'
import type { Severity, RuleCategory, CategoryScore } from '@/types'
import {
  Sparkles,
  ArrowLeft,
  Eye,
  Type,
  Ruler,
  Accessibility,
  AlertCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'

const CATEGORY_ICON: Record<RuleCategory, typeof Eye> = {
  color: Eye,
  typography: Type,
  spacing: Ruler,
  accessibility: Accessibility,
}

<<<<<<< HEAD
const CATEGORY_COLOR: Record<RuleCategory, { text: string; bg: string; border: string; ring: string }> = {
  color: {
    text: 'text-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-500/15',
    border: 'border-violet-200 dark:border-violet-500/20',
    ring: 'ring-violet-500/20',
  },
  typography: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-200 dark:border-blue-500/20',
    ring: 'ring-blue-500/20',
  },
  spacing: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    ring: 'ring-emerald-500/20',
  },
  accessibility: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
    ring: 'ring-amber-500/20',
  },
}

const SEVERITY_CONFIG: Record<Severity, { icon: typeof AlertCircle; label: string; variant: 'destructive' | 'warning' | 'secondary'; color: string }> = {
  error: { icon: AlertCircle, label: '严重', variant: 'destructive', color: 'text-red-400' },
  warning: { icon: AlertTriangle, label: '警告', variant: 'warning', color: 'text-amber-400' },
  info: { icon: Info, label: '建议', variant: 'secondary', color: 'text-blue-400' },
=======
const CATEGORY_COLOR: Record<RuleCategory, string> = {
  color: 'text-violet-300',
  typography: 'text-sky-300',
  spacing: 'text-emerald-300',
  accessibility: 'text-amber-300',
}

const CATEGORY_BG: Record<RuleCategory, string> = {
  color: 'bg-violet-500/15',
  typography: 'bg-sky-500/15',
  spacing: 'bg-emerald-500/15',
  accessibility: 'bg-amber-500/15',
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
}

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  let color = '#22c55e'
  let gradientId = 'score-grad'
  if (score < 60) color = '#ef4444'
  else if (score < 80) color = '#f59e0b'

  const TrendIcon = score >= 80 ? TrendingUp : score >= 60 ? Minus : TrendingDown

  return (
    <div className="relative inline-flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border/30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold tracking-tight" style={{ color }}>{score}</span>
          <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm" style={{ color }}>
        <TrendIcon className="h-4 w-4" />
        <span className="font-medium">
          {score >= 80 ? '表现优秀' : score >= 60 ? '有改进空间' : '需要优化'}
        </span>
      </div>
    </div>
  )
}

function CategoryCard({ data, isActive, onClick }: { data: CategoryScore; isActive: boolean; onClick: () => void }) {
  const Icon = CATEGORY_ICON[data.category]
  const colors = CATEGORY_COLOR[data.category]

  let scoreColor = 'text-emerald-400'
  if (data.score < 60) scoreColor = 'text-red-400'
  else if (data.score < 80) scoreColor = 'text-amber-400'

  const errorCount = data.issues.filter(i => i.severity === 'error').length
  const warnCount = data.issues.filter(i => i.severity === 'warning').length

  return (
<<<<<<< HEAD
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? `${colors.border} bg-card ring-2 ${colors.ring} shadow-sm`
          : 'border-border/40 bg-card hover:border-border/80 hover:bg-card/80'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${colors.bg}`}>
          <Icon className={`h-4.5 w-4.5 ${colors.text}`} />
=======
    <Card className="border-border/60 bg-card/75 backdrop-blur-sm">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
        </div>
        <span className={`text-2xl font-bold tabular-nums ${scoreColor}`}>{data.score}</span>
      </div>
      <div className="text-sm font-medium mb-1">{data.label}</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {errorCount > 0 && <span className="text-red-400">{errorCount} 严重</span>}
        {warnCount > 0 && <span className="text-amber-400">{warnCount} 警告</span>}
        {errorCount === 0 && warnCount === 0 && <span className="text-emerald-400">无问题</span>}
      </div>
    </button>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-accent"
    >
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
      {copied ? '已复制' : '复制'}
    </button>
  )
}

export function ReportPage() {
  const navigate = useNavigate()
  const { report, activeTab, setActiveTab } = useAnalysisStore()

  useEffect(() => {
    if (!report) {
      navigate('/analyze')
    }
  }, [report, navigate])

  if (!report) return null

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold tracking-tight">Visual Optimizer</span>
=======
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/60 backdrop-blur-xl sticky top-0 z-50 bg-background/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Visual Optimizer
              </span>
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/analyze">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8">
                <ArrowLeft className="h-3.5 w-3.5" />
                返回编辑
              </Button>
            </Link>
            <Link to="/analyze">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8" onClick={() => useAnalysisStore.getState().reset()}>
                <RotateCcw className="h-3.5 w-3.5" />
                新分析
              </Button>
            </Link>
            <div className="w-px h-5 bg-border/60" />
            <ThemeToggle />
          </div>
        </div>
      </header>

<<<<<<< HEAD
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <section className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mb-10 p-8 rounded-2xl bg-card border border-border/40">
=======
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <section className="flex flex-col sm:flex-row items-center gap-8 mb-10 rounded-2xl border border-border/60 bg-card/55 p-6 backdrop-blur-sm">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
          <ScoreRing score={report.overallScore} />
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl font-bold mb-2">分析报告</h1>
            <p className="text-muted-foreground mb-6">
              共检测到 <span className="font-semibold text-foreground">{report.totalIssues}</span> 个问题，
              生成于 {new Date(report.timestamp).toLocaleString('zh-CN')}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {report.categories.map((cat) => (
                <CategoryCard
                  key={cat.category}
                  data={cat}
                  isActive={activeTab === cat.category}
                  onClick={() => setActiveTab(cat.category)}
                />
              ))}
            </div>
          </div>
        </section>

        <section>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RuleCategory)}>
<<<<<<< HEAD
            <TabsList className="w-full sm:w-auto mb-4 bg-surface border border-border/40">
=======
            <TabsList className="w-full sm:w-auto border border-border/60 bg-card/60">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
              {report.categories.map((cat) => {
                const Icon = CATEGORY_ICON[cat.category]
                return (
                  <TabsTrigger key={cat.category} value={cat.category} className="gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{cat.label}</span>
                    {cat.issues.length > 0 && (
                      <span className="ml-1 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-semibold">
                        {cat.issues.length}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {report.categories.map((cat) => (
              <TabsContent key={cat.category} value={cat.category}>
                {cat.issues.length === 0 ? (
<<<<<<< HEAD
                  <div className="py-16 text-center rounded-2xl border border-border/40 bg-card">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
                      <Check className="h-8 w-8 text-emerald-400" />
                    </div>
                    <p className="text-lg font-medium mb-1">表现优秀</p>
                    <p className="text-sm text-muted-foreground">此维度未发现问题</p>
                  </div>
=======
                  <Card className="border-border/60 bg-card/75">
                    <CardContent className="py-12 text-center">
                      <div className="text-4xl mb-3">&#10003;</div>
                      <p className="text-muted-foreground">此维度未发现问题，表现优秀！</p>
                    </CardContent>
                  </Card>
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                ) : (
                  <div className="space-y-3">
                    {cat.issues.map((issue) => {
                      const sevConfig = SEVERITY_CONFIG[issue.severity]
                      const SevIcon = sevConfig.icon
                      return (
<<<<<<< HEAD
                        <div key={issue.id} className="rounded-xl border border-border/40 bg-card overflow-hidden">
                          <div className="flex items-start gap-3 p-4 pb-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                              issue.severity === 'error'
                                ? 'bg-red-500/10'
                                : issue.severity === 'warning'
                                ? 'bg-amber-500/10'
                                : 'bg-blue-500/10'
                            } mt-0.5 shrink-0`}>
                              <SevIcon className={`h-4 w-4 ${sevConfig.color}`} />
=======
                        <Card key={issue.id} className="border-border/60 bg-card/75">
                          <CardHeader className="pb-2">
                            <div className="flex items-start gap-3">
                              <SevIcon className={`h-5 w-5 mt-0.5 ${
                                issue.severity === 'error'
                                  ? 'text-destructive'
                                  : issue.severity === 'warning'
                                  ? 'text-warning'
                                  : 'text-muted-foreground'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <CardTitle className="text-sm font-medium">
                                    {issue.message}
                                  </CardTitle>
                                  <Badge variant={sevConfig.variant} className="text-[10px] px-1.5 py-0">
                                    {sevConfig.label}
                                  </Badge>
                                </div>
                                {issue.element && (
                                  <code className="text-xs text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded">
                                    {issue.element}
                                  </code>
                                )}
                              </div>
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="text-sm font-medium">{issue.message}</span>
                                <Badge variant={sevConfig.variant} className="text-[10px] px-1.5 py-0">
                                  {sevConfig.label}
                                </Badge>
                              </div>
                              {issue.element && (
                                <code className="text-xs text-muted-foreground bg-surface border border-border/40 px-2 py-0.5 rounded-md font-mono">
                                  {issue.element}
                                </code>
                              )}
                            </div>
                          </div>

                          <div className="px-4 pb-4 pl-15">
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {issue.suggestion}
                            </p>
                            {issue.fixCode && (
<<<<<<< HEAD
                              <div className="relative group">
                                <pre className="text-xs bg-surface border border-border/40 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed">
=======
                              <div className="relative">
                                <pre className="text-xs bg-background/70 border border-border/60 rounded-lg p-3 overflow-x-auto">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                                  <code>{issue.fixCode}</code>
                                </pre>
                                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <CopyButton text={issue.fixCode} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      <footer className="border-t border-border/40 py-6 px-6 mt-8 bg-surface">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>Visual Optimizer &copy; {new Date().getFullYear()}</span>
          <a
            href="https://github.com/KJNotfound/Visual-Optimizer"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
