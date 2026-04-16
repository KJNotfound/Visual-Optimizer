import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Eye,
  Type,
  Ruler,
  Accessibility,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Code2,
} from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: '色彩对比度',
    description: '基于 WCAG 2.1 标准检测文本与背景的对比度，确保内容可读性',
<<<<<<< HEAD
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-500/15',
    border: 'border-violet-200 dark:border-violet-500/20',
    glow: 'group-hover:shadow-violet-500/10',
=======
    color: 'text-violet-300',
    bg: 'bg-violet-500/15',
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
  },
  {
    icon: Type,
    title: '字体排版',
    description: '分析标题层级、字体数量、行高比例，优化排版节奏',
<<<<<<< HEAD
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-200 dark:border-blue-500/20',
    glow: 'group-hover:shadow-blue-500/10',
=======
    color: 'text-sky-300',
    bg: 'bg-sky-500/15',
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
  },
  {
    icon: Ruler,
    title: '间距一致性',
    description: '检查间距是否遵循统一的网格系统，消除视觉混乱',
<<<<<<< HEAD
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    glow: 'group-hover:shadow-emerald-500/10',
=======
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
  },
  {
    icon: Accessibility,
    title: '可访问性',
    description: '检查 alt 属性、链接文本、表单标签等基础无障碍要素',
<<<<<<< HEAD
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-200 dark:border-amber-500/20',
    glow: 'group-hover:shadow-amber-500/10',
=======
    color: 'text-amber-300',
    bg: 'bg-amber-500/15',
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
  },
]

const highlights = [
  { icon: Zap, text: '纯前端运行，无需后端' },
  { icon: Shield, text: '代码不上传，完全本地' },
  { icon: Code2, text: '一键复制修复代码' },
]

const steps = [
  { num: '01', title: '粘贴代码', desc: '输入 HTML 和 CSS 代码，或使用内置示例' },
  { num: '02', title: '智能分析', desc: '引擎在浏览器沙箱中渲染并逐项检测' },
  { num: '03', title: '获取报告', desc: '查看评分、问题详情与可复制的修复方案' },
]

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
<<<<<<< HEAD
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/70">
=======
      <header className="border-b border-border/60 backdrop-blur-xl sticky top-0 z-50 bg-background/70">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Visual Optimizer</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/analyze">
              <Button size="sm" className="gap-1.5">
                开始使用
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
<<<<<<< HEAD
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/0.08,transparent_70%)]" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Web Visual Quality Analyzer
=======
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/35 bg-primary/15 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Visual Optimizer
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              让每个像素
              <br />
<<<<<<< HEAD
              <span className="bg-gradient-to-r from-primary via-violet-400 to-blue-400 bg-clip-text text-transparent">
=======
              <span className="bg-gradient-to-r from-primary via-violet-300 to-sky-300 bg-clip-text text-transparent">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                都有据可依
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              粘贴你的 HTML 和 CSS 代码，即刻获得色彩、排版、间距、可访问性四大维度的深度分析报告与可操作的优化建议
            </p>

            <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
              {highlights.map((h) => (
                <span
                  key={h.text}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-surface border border-border/60 rounded-full px-3 py-1.5"
                >
                  <h.icon className="h-3 w-3 text-primary" />
                  {h.text}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <Link to="/analyze">
                <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  开始分析
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
<<<<<<< HEAD
              <a href="https://github.com/KJNotfound/Visual-Optimizer" target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  GitHub
=======
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  了解更多
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                </Button>
              </a>
            </div>
          </div>
        </section>

<<<<<<< HEAD
        <section className="py-24 px-6 border-t border-border/40 bg-surface">
=======
        <section className="py-20 px-6 bg-card/35 border-y border-border/40">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Features</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">四大检测维度</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                覆盖视觉设计中最关键的质量指标，每一项都有明确的行业标准支撑
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f) => (
<<<<<<< HEAD
                <div
                  key={f.title}
                  className={`group relative rounded-2xl border ${f.border} bg-card p-6 transition-all hover:shadow-lg ${f.glow} hover:-translate-y-0.5`}
                >
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.bg} mb-5`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
=======
                <Card key={f.title} className="group border-border/60 bg-card/70 backdrop-blur-sm hover:border-primary/45 hover:-translate-y-1 transition-all duration-200">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${f.bg} mb-4`}
                    >
                      <f.icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 border-t border-border/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">How it works</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">三步即可完成</h2>
              <p className="text-muted-foreground">简单、快速、无需安装</p>
            </div>
<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div key={s.num} className="relative text-center p-8 rounded-2xl bg-card border border-border/60">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-border z-10">
                      <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg mb-5">
=======
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.num} className="text-center rounded-xl border border-border/50 bg-card/50 p-6">
                  <div className="text-5xl font-bold text-primary/25 mb-3">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 px-6 bg-surface">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
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
