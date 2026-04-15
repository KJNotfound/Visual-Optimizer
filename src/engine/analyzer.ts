import type { AnalysisReport, Issue, RuleCategory } from '@/types'
import { parseInput, cleanup } from './parser'
import { rules } from './rules'
import { calculateCategoryScore, calculateOverallScore } from './scorer'

const ALL_CATEGORIES: RuleCategory[] = ['color', 'typography', 'spacing', 'accessibility']

export async function analyzeCode(html: string, css: string): Promise<AnalysisReport> {
  const page = parseInput(html, css)

  await new Promise((resolve) => setTimeout(resolve, 100))

  let allIssues: Issue[] = []

  for (const rule of rules) {
    try {
      const ruleIssues = rule.analyze(page.doc)
      allIssues = allIssues.concat(ruleIssues)
    } catch (err) {
      console.warn(`Rule "${rule.id}" failed:`, err)
    }
  }

  cleanup(page)

  const categoryScores = ALL_CATEGORIES.map((cat) =>
    calculateCategoryScore(cat, allIssues)
  )
  const overallScore = calculateOverallScore(categoryScores)

  return {
    overallScore,
    categories: categoryScores,
    totalIssues: allIssues.length,
    timestamp: Date.now(),
  }
}
