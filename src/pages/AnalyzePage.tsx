import { useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAnalysisStore } from '@/store/analysis-store'
import {
  Sparkles,
  Play,
  RotateCcw,
  FileCode,
  Eye,
  Loader2,
  ArrowLeft,
} from 'lucide-react'

const SAMPLE_HTML = `<header>
  <nav>
    <a href="#">Logo</a>
    <a href="#">首页</a>
    <a href="#">关于</a>
    <a href="#">点击这里</a>
  </nav>
</header>
<main>
  <h1>欢迎来到我的网站</h1>
  <h3>这是一个副标题</h3>
  <h2>这是另一个标题</h2>
  <p>这是一段正文内容，用来展示排版效果。</p>
  <p style="font-size: 10px;">这段文字太小了</p>
  <img src="photo.jpg">
  <button>提交</button>
  <input type="text" placeholder="请输入...">
  <div class="card" style="padding: 13px; margin: 7px;">
    <p style="color: #aaa; background-color: #fff;">
      这段文字对比度不够
    </p>
  </div>
</main>`

const SAMPLE_CSS = `body {
  font-family: Arial, Helvetica, 'Times New Roman', Georgia, sans-serif;
  margin: 0;
  padding: 20px;
  background: #ffffff;
}
header {
  background: #6366f1;
  padding: 15px 20px;
  margin-bottom: 30px;
}
nav a {
  color: #9495ff;
  margin-right: 15px;
  text-decoration: none;
}
h1 { font-size: 28px; color: #333; }
h2 { font-size: 26px; color: #333; }
h3 { font-size: 30px; color: #333; }
p { font-size: 16px; line-height: 18px; color: #333; }
.card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 20px;
}
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}`

export function AnalyzePage() {
  const navigate = useNavigate()
  const previewRef = useRef<HTMLIFrameElement>(null)
  const {
    htmlInput,
    cssInput,
    status,
    errorMessage,
    setHtmlInput,
    setCssInput,
    runAnalysis,
    reset,
  } = useAnalysisStore()

  const updatePreview = useCallback(() => {
    const iframe = previewRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(`<!DOCTYPE html><html><head><style>${cssInput}</style></head><body>${htmlInput}</body></html>`)
    doc.close()
  }, [htmlInput, cssInput])

  useEffect(() => {
    const timer = setTimeout(updatePreview, 300)
    return () => clearTimeout(timer)
  }, [updatePreview])

  useEffect(() => {
    if (status === 'done') {
      navigate('/report')
    }
  }, [status, navigate])

  const loadSample = () => {
    setHtmlInput(SAMPLE_HTML)
    setCssInput(SAMPLE_CSS)
  }

  const handleAnalyze = () => {
    runAnalysis()
  }

  const handleReset = () => {
    reset()
    const iframe = previewRef.current
    if (iframe?.contentDocument) {
      iframe.contentDocument.open()
      iframe.contentDocument.write('')
      iframe.contentDocument.close()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="w-px h-5 bg-border/60" />
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold tracking-tight">Visual Optimizer</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadSample} className="gap-1.5 text-xs h-8">
              <FileCode className="h-3.5 w-3.5" />
              加载示例
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs h-8">
              <RotateCcw className="h-3.5 w-3.5" />
              重置
            </Button>
            <div className="w-px h-5 bg-border/60" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 h-[calc(100vh-7.5rem)]">
          <div className="flex flex-col gap-3 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-surface">
                <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">HTML</span>
              </div>
              <div className="flex-1 p-2 min-h-0">
                <Textarea
                  placeholder="粘贴你的 HTML 代码..."
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  className="h-full resize-none text-xs leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-surface">
                <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CSS</span>
              </div>
              <div className="flex-1 p-2 min-h-0">
                <Textarea
                  placeholder="粘贴你的 CSS 代码（可选）..."
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  className="h-full resize-none text-xs leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-surface">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
              </div>
              <div className="flex-1 p-2 min-h-0">
                <div className="h-full rounded-lg border border-border/40 bg-white overflow-hidden">
                  <iframe
                    ref={previewRef}
                    title="preview"
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 h-11 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={handleAnalyze}
              disabled={status === 'analyzing' || !htmlInput.trim()}
            >
              {status === 'analyzing' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  开始分析
                </>
              )}
            </Button>

            {errorMessage && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
