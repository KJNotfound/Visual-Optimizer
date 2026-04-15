import type { Rule } from './types'
import type { Issue } from '@/types'
import { getAllTextElements, getComputedStyleSafe } from '@/engine/parser'

interface RGB {
  r: number
  g: number
  b: number
}

function parseColor(colorStr: string): RGB | null {
  const match = colorStr.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
  )
  if (!match) return null
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  }
}

function sRGBtoLinear(value: number): number {
  const v = value / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function relativeLuminance(rgb: RGB): number {
  const r = sRGBtoLinear(rgb.r)
  const g = sRGBtoLinear(rgb.g)
  const b = sRGBtoLinear(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(fg: RGB, bg: RGB): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getEffectiveBackground(el: Element): RGB {
  let current: Element | null = el
  while (current) {
    const style = getComputedStyleSafe(current)
    if (style) {
      const bg = parseColor(style.backgroundColor)
      if (bg && !(bg.r === 0 && bg.g === 0 && bg.b === 0 && style.backgroundColor.includes('0)'))) {
        if (!style.backgroundColor.includes('rgba') || !style.backgroundColor.includes(', 0)')) {
          return bg
        }
      }
    }
    current = current.parentElement
  }
  return { r: 255, g: 255, b: 255 }
}

function elementSelector(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const id = el.id ? `#${el.id}` : ''
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
    : ''
  return `${tag}${id}${cls}`
}

function isLargeText(style: CSSStyleDeclaration): boolean {
  const size = parseFloat(style.fontSize)
  const weight = parseInt(style.fontWeight, 10)
  const isBold = weight >= 700 || style.fontWeight === 'bold'
  return size >= 24 || (size >= 18.66 && isBold)
}

export const colorContrastRule: Rule = {
  id: 'color-contrast',
  name: '色彩对比度',
  category: 'color',
  description: '检查文本与背景色的对比度是否符合 WCAG 2.1 标准',

  analyze(doc: Document): Issue[] {
    const issues: Issue[] = []
    const elements = getAllTextElements(doc)
    let counter = 0

    for (const el of elements) {
      const textContent = el.textContent?.trim()
      if (!textContent) continue

      const style = getComputedStyleSafe(el)
      if (!style) continue

      const fg = parseColor(style.color)
      if (!fg) continue

      const bg = getEffectiveBackground(el)
      const ratio = contrastRatio(fg, bg)
      const large = isLargeText(style)
      const requiredRatio = large ? 3 : 4.5
      const aaLevel = large ? 'AA (大文本 ≥3:1)' : 'AA (≥4.5:1)'

      if (ratio < requiredRatio) {
        counter++
        const severity = ratio < 2 ? 'error' as const : 'warning' as const
        issues.push({
          id: `cc-${counter}`,
          ruleId: 'color-contrast',
          category: 'color',
          severity,
          message: `对比度不足：${ratio.toFixed(2)}:1，要求 ${aaLevel}`,
          element: elementSelector(el),
          suggestion: `提高文本颜色与背景色之间的对比度至 ${requiredRatio}:1 以上`,
          fixCode: ratio < 3
            ? `/* 建议将文本颜色改为更深的颜色 */\n${elementSelector(el)} {\n  color: #1a1a1a;\n}`
            : undefined,
          details: {
            currentRatio: parseFloat(ratio.toFixed(2)),
            requiredRatio,
            foreground: `rgb(${fg.r}, ${fg.g}, ${fg.b})`,
            background: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
          },
        })
      }
    }

    return issues
  },
}
