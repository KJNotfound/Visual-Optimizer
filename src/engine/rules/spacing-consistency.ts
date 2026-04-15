import type { Rule } from './types'
import type { Issue } from '@/types'
import { getAllElements, getComputedStyleSafe } from '@/engine/parser'

function isOnGrid(value: number, base: number): boolean {
  if (value === 0) return true
  return value % base === 0
}

function elementSelector(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const id = el.id ? `#${el.id}` : ''
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
    : ''
  return `${tag}${id}${cls}`
}

const IGNORED_TAGS = new Set(['html', 'head', 'meta', 'link', 'script', 'style', 'title', 'br', 'hr'])

export const spacingConsistencyRule: Rule = {
  id: 'spacing-consistency',
  name: '间距一致性',
  category: 'spacing',
  description: '检查 margin/padding 是否遵循一致的间距系统（4px 或 8px 网格）',

  analyze(doc: Document): Issue[] {
    const issues: Issue[] = []
    let counter = 0
    const allValues: number[] = []
    const offGridElements: { el: Element; prop: string; value: number }[] = []

    const spacingProps = [
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    ] as const

    const elements = getAllElements(doc)

    for (const el of elements) {
      const tag = el.tagName.toLowerCase()
      if (IGNORED_TAGS.has(tag)) continue

      const style = getComputedStyleSafe(el)
      if (!style) continue

      for (const prop of spacingProps) {
        const raw = style[prop as unknown as number] as string
        const value = parseFloat(raw)
        if (isNaN(value) || value === 0) continue

        allValues.push(value)

        if (!isOnGrid(Math.round(value), 4)) {
          offGridElements.push({ el, prop, value: Math.round(value) })
        }
      }
    }

    if (allValues.length === 0) return issues

    const offGridRatio = offGridElements.length / allValues.length

    if (offGridRatio > 0.3) {
      counter++
      issues.push({
        id: `sc-${counter}`,
        ruleId: 'spacing-consistency',
        category: 'spacing',
        severity: 'warning',
        message: `${(offGridRatio * 100).toFixed(0)}% 的间距值不在 4px 网格上`,
        suggestion: '建议统一使用 4px 或 8px 的倍数作为间距值，保持视觉节奏一致',
      })
    }

    const uniqueValues = [...new Set(allValues.map(v => Math.round(v)))]
    if (uniqueValues.length > 15) {
      counter++
      issues.push({
        id: `sc-${counter}`,
        ruleId: 'spacing-consistency',
        category: 'spacing',
        severity: 'info',
        message: `使用了 ${uniqueValues.length} 种不同的间距值，建议精简`,
        suggestion: '定义一套间距规范（如 4, 8, 12, 16, 24, 32, 48, 64px），减少间距值的种类',
        details: { uniqueValues: uniqueValues.sort((a, b) => a - b) },
      })
    }

    const sampleOffGrid = offGridElements.slice(0, 5)
    for (const item of sampleOffGrid) {
      counter++
      const nearest = Math.round(item.value / 4) * 4
      const propName = item.prop.replace(/([A-Z])/g, '-$1').toLowerCase()
      issues.push({
        id: `sc-${counter}`,
        ruleId: 'spacing-consistency',
        category: 'spacing',
        severity: 'info',
        message: `${elementSelector(item.el)} 的 ${propName} 为 ${item.value}px，不在 4px 网格上`,
        element: elementSelector(item.el),
        suggestion: `将 ${propName} 调整为最近的 4px 倍数：${nearest}px`,
        fixCode: `${elementSelector(item.el)} {\n  ${propName}: ${nearest}px;\n}`,
      })
    }

    return issues
  },
}
