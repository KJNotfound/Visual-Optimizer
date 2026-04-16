import { useRef, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
<<<<<<< HEAD
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/ThemeToggle'
=======
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
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

type CodeLanguage = 'html' | 'css'

function CodeEditor({
  value,
  onChange,
  placeholder,
  language,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  language: CodeLanguage
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border border-input bg-background">
      <Editor
        height="100%"
        language={language}
        path={`analyze-input.${language}`}
        value={value}
        theme="vs-dark"
        loading={<div className="h-full w-full bg-background" />}
        onChange={(newValue) => onChange(newValue ?? '')}
        options={{
          fontSize: 12,
          lineHeight: 20,
          tabSize: 2,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          bracketPairColorization: { enabled: true },
          smoothScrolling: true,
          fontFamily: "JetBrains Mono, Consolas, 'Courier New', monospace",
          padding: { top: 12, bottom: 12 },
        }}
      />
      {!value && (
        <div className="pointer-events-none absolute left-10 top-3 text-xs text-muted-foreground font-mono z-10">
          {placeholder}
        </div>
      )}
    </div>
  )
}

export function AnalyzePage() {
  const navigate = useNavigate()
  const previewRef = useRef<HTMLIFrameElement>(null)
  const prevStatusRef = useRef<'idle' | 'analyzing' | 'done' | 'error' | null>(null)
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
    const scrollbarStyles = `
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(130, 151, 198, 0.65) rgba(17, 26, 45, 0.75);
      }
      *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      *::-webkit-scrollbar-track {
        background: rgba(17, 26, 45, 0.75);
        border-radius: 9999px;
      }
      *::-webkit-scrollbar-thumb {
        background: rgba(130, 151, 198, 0.65);
        border-radius: 9999px;
        border: 2px solid rgba(17, 26, 45, 0.75);
      }
      *::-webkit-scrollbar-thumb:hover {
        background: rgba(163, 182, 224, 0.82);
      }
    `
    doc.open()
    doc.write(`<!DOCTYPE html><html><head><style>${scrollbarStyles}${cssInput}</style></head><body>${htmlInput}</body></html>`)
    doc.close()
  }, [htmlInput, cssInput])

  useEffect(() => {
    const timer = setTimeout(updatePreview, 300)
    return () => clearTimeout(timer)
  }, [updatePreview])

  useEffect(() => {
    const prevStatus = prevStatusRef.current
    if (prevStatus !== null && status === 'done' && prevStatus !== 'done') {
      navigate('/report')
    }
    prevStatusRef.current = status
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
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
=======
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/60 backdrop-blur-xl sticky top-0 z-50 bg-background/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
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

<<<<<<< HEAD
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
=======
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
          <div className="flex flex-col gap-4 min-h-0">
            <Card className="flex-1 flex flex-col min-h-0 border-border/60 bg-card/75 backdrop-blur-sm shadow-lg shadow-black/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  HTML
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-3 min-h-0">
                <CodeEditor
                  placeholder="粘贴你的 HTML 代码..."
                  value={htmlInput}
                  onChange={setHtmlInput}
                  language="html"
                />
              </CardContent>
            </Card>
            <Card className="flex-1 flex flex-col min-h-0 border-border/60 bg-card/75 backdrop-blur-sm shadow-lg shadow-black/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  CSS
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-3 min-h-0">
                <CodeEditor
                  placeholder="粘贴你的 CSS 代码（可选）..."
                  value={cssInput}
                  onChange={setCssInput}
                  language="css"
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="flex flex-col gap-3 min-h-0">
            <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-surface">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
              </div>
              <div className="flex-1 p-2 min-h-0">
                <div className="h-full rounded-lg border border-border/40 bg-white overflow-hidden">
=======
          <div className="flex flex-col gap-4 min-h-0">
            <Card className="flex-1 flex flex-col min-h-0 border-border/60 bg-card/75 backdrop-blur-sm shadow-lg shadow-black/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  实时预览
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-4 min-h-0">
                <div className="h-full rounded-lg border border-border/70 bg-white overflow-hidden shadow-inner">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
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
<<<<<<< HEAD
              className="w-full gap-2 h-11 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
=======
              className="w-full gap-2 h-12 text-base bg-gradient-to-r from-primary to-sky-400 text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/25"
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
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
<<<<<<< HEAD
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
=======
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/40 rounded-lg px-4 py-3">
>>>>>>> 45e99f3 (feat: upgrade editor and dark theme polish)
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
