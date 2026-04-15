export type Severity = 'error' | 'warning' | 'info'

export type RuleCategory = 'color' | 'typography' | 'spacing' | 'accessibility'

export interface Issue {
  id: string
  ruleId: string
  category: RuleCategory
  severity: Severity
  message: string
  element?: string
  suggestion: string
  fixCode?: string
  details?: Record<string, unknown>
}

export interface CategoryScore {
  category: RuleCategory
  label: string
  score: number
  issues: Issue[]
}

export interface AnalysisReport {
  overallScore: number
  categories: CategoryScore[]
  totalIssues: number
  timestamp: number
}

export interface ParsedPage {
  iframe: HTMLIFrameElement
  doc: Document
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'done' | 'error'
