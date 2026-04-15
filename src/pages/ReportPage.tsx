import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
} from 'lucide-react'
import { useState } from 'react'

const CATEGORY_ICON: Record<RuleCategory, typeof Eye> = {
  color: Eye,
  typography: Type,
  spacing: Ruler,
  accessibility: Accessibility,
}

const CATEGORY_COLOR: Record<RuleCategory, string> = {
  color: 'text-violet-500',
  typography: 'text-blue-500',
  spacing: 'text-emerald-500',
  accessibility: 'text-amber-500',
}

const CATEGORY_BG: Record<RuleCategory, string> = {
  color: 'bg-violet-50',
  typography: 'bg-blue-50',
  spacing: 'bg-emerald-50',
  accessibility: 'bg-amber-50',
}

const SEVERITY_CONFIG: Record<Severity, { icon: typeof AlertCircle; label: string; variant: 'destructive' | 'warning' | 'secondary' }> = {
  error: { icon: AlertCircle, label: '严重', variant: 'destructive' },
  warning: { icon: AlertTriangle, label: '警告', variant: 'warning' },
  info: { icon: Info, label: '建议', variant: 'secondary' },
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  let color = '#22c55e'
  if (score < 60) color = '#ef4444'
  else if (score < 80) color = '#f59e0b'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground">总分</span>
      </div>
    </div>
  )
}

function CategoryCard({ data }: { data: CategoryScore }) {
  const Icon = CATEGORY_ICON[data.category]
  const iconColor = CATEGORY_COLOR[data.category]
  const iconBg = CATEGORY_BG[data.category]

  let scoreColor = 'text-success'
  if (data.score < 60) scoreColor = 'text-destructive'
  else if (data.score < 80) scoreColor = 'text-warning'

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.issues.length} 个问题</div>
        </div>
        <div className={`text-2xl font-bold ${scoreColor}`}>{data.score}</div>
      </CardContent>
    </Card>
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
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                VibeCoding
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/analyze">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                返回编辑
              </Button>
            </Link>
            <Link to="/analyze">
              <Button size="sm" className="gap-1.5" onClick={() => useAnalysisStore.getState().reset()}>
                <RotateCcw className="h-3.5 w-3.5" />
                新分析
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <section className="flex flex-col sm:flex-row items-center gap-8 mb-10">
          <ScoreRing score={report.overallScore} />
          <div>
            <h1 className="text-2xl font-bold mb-1">分析报告</h1>
            <p className="text-muted-foreground">
              共检测到 <span className="font-semibold text-foreground">{report.totalIssues}</span> 个问题，
              生成于 {new Date(report.timestamp).toLocaleString('zh-CN')}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {report.categories.map((cat) => (
            <CategoryCard key={cat.category} data={cat} />
          ))}
        </section>

        <section>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RuleCategory)}>
            <TabsList className="w-full sm:w-auto">
              {report.categories.map((cat) => {
                const Icon = CATEGORY_ICON[cat.category]
                return (
                  <TabsTrigger key={cat.category} value={cat.category} className="gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{cat.label}</span>
                    {cat.issues.length > 0 && (
                      <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5">
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
                  <Card className="border-border/50">
                    <CardContent className="py-12 text-center">
                      <div className="text-4xl mb-3">&#10003;</div>
                      <p className="text-muted-foreground">此维度未发现问题，表现优秀！</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {cat.issues.map((issue) => {
                      const sevConfig = SEVERITY_CONFIG[issue.severity]
                      const SevIcon = sevConfig.icon
                      return (
                        <Card key={issue.id} className="border-border/50">
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
                                  <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {issue.element}
                                  </code>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pl-11">
                            <p className="text-sm text-muted-foreground mb-2">
                              {issue.suggestion}
                            </p>
                            {issue.fixCode && (
                              <div className="relative">
                                <pre className="text-xs bg-muted/70 rounded-lg p-3 overflow-x-auto">
                                  <code>{issue.fixCode}</code>
                                </pre>
                                <div className="absolute top-2 right-2">
                                  <CopyButton text={issue.fixCode} />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      <footer className="border-t border-border/50 py-6 px-6 mt-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          VibeCoding &copy; {new Date().getFullYear()} &mdash; 前端视觉优化工具
        </div>
      </footer>
    </div>
  )
}
