import type { Issue, RuleCategory, CategoryScore } from '@/types'

const SEVERITY_PENALTY = {
  error: 15,
  warning: 8,
  info: 3,
} as const

const CATEGORY_WEIGHTS: Record<RuleCategory, number> = {
  color: 0.3,
  typography: 0.25,
  spacing: 0.25,
  accessibility: 0.2,
}

const CATEGORY_LABELS: Record<RuleCategory, string> = {
  color: '色彩对比度',
  typography: '字体排版',
  spacing: '间距一致性',
  accessibility: '可访问性',
}

export function calculateCategoryScore(category: RuleCategory, issues: Issue[]): CategoryScore {
  const categoryIssues = issues.filter((i) => i.category === category)
  const totalPenalty = categoryIssues.reduce(
    (sum, issue) => sum + SEVERITY_PENALTY[issue.severity],
    0
  )
  const score = Math.max(0, Math.min(100, 100 - totalPenalty))

  return {
    category,
    label: CATEGORY_LABELS[category],
    score,
    issues: categoryIssues,
  }
}

export function calculateOverallScore(categoryScores: CategoryScore[]): number {
  const weighted = categoryScores.reduce((sum, cs) => {
    return sum + cs.score * (CATEGORY_WEIGHTS[cs.category] || 0)
  }, 0)
  return Math.round(Math.max(0, Math.min(100, weighted)))
}
