import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Eye,
  Type,
  Ruler,
  Accessibility,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: '色彩对比度',
    description: '基于 WCAG 2.1 标准检测文本与背景的对比度，确保内容可读性',
    color: 'text-violet-300',
    bg: 'bg-violet-500/15',
  },
  {
    icon: Type,
    title: '字体排版',
    description: '分析标题层级、字体数量、行高比例，优化排版节奏',
    color: 'text-sky-300',
    bg: 'bg-sky-500/15',
  },
  {
    icon: Ruler,
    title: '间距一致性',
    description: '检查间距是否遵循统一的网格系统，消除视觉混乱',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
  },
  {
    icon: Accessibility,
    title: '可访问性',
    description: '检查 alt 属性、链接文本、表单标签等基础无障碍要素',
    color: 'text-amber-300',
    bg: 'bg-amber-500/15',
  },
]

const steps = [
  { num: '01', title: '粘贴代码', desc: '输入你的 HTML 和 CSS 代码' },
  { num: '02', title: '自动分析', desc: '引擎运行四大维度检测' },
  { num: '03', title: '查看报告', desc: '获取评分、问题列表与修复建议' },
]

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/60 backdrop-blur-xl sticky top-0 z-50 bg-background/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">Visual Optimizer</span>
          </div>
          <Link to="/analyze">
            <Button variant="outline" size="sm">
              开始使用
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/35 bg-primary/15 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Visual Optimizer
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
              让每个像素
              <br />
              <span className="bg-gradient-to-r from-primary via-violet-300 to-sky-300 bg-clip-text text-transparent">
                都有据可依
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              粘贴你的 HTML 和 CSS 代码，即刻获得色彩对比度、字体层级、间距一致性、可访问性四大维度的深度分析报告与可操作的优化建议。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/analyze">
                <Button size="lg" className="gap-2">
                  开始分析
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  了解更多
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-card/35 border-y border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">四大检测维度</h2>
              <p className="text-muted-foreground">
                覆盖视觉设计中最关键的质量指标
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
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
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3">三步即可完成</h2>
              <p className="text-muted-foreground">简单、快速、无需安装</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.num} className="text-center rounded-xl border border-border/50 bg-card/50 p-6">
                  <div className="text-5xl font-bold text-primary/25 mb-3">
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          Visual Optimizer &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
