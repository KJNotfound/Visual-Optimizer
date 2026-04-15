import type { Rule } from './types'
import type { Issue } from '@/types'
import { getAllTextElements, getComputedStyleSafe } from '@/engine/parser'

function elementSelector(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const id = el.id ? `#${el.id}` : ''
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
    : ''
  return `${tag}${id}${cls}`
}

export const fontHierarchyRule: Rule = {
  id: 'font-hierarchy',
  name: '字体层级',
  category: 'typography',
  description: '检查标题层级、字体种类数量、行高与字号比例',

  analyze(doc: Document): Issue[] {
    const issues: Issue[] = []
    let counter = 0

    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
    const headingSizes: { tag: string; size: number; el: Element }[] = []

    for (const tag of headingTags) {
      const els = doc.querySelectorAll(tag)
      els.forEach((el) => {
        const style = getComputedStyleSafe(el)
        if (style) {
          headingSizes.push({
            tag,
            size: parseFloat(style.fontSize),
            el,
          })
        }
      })
    }

    const sizeByTag = new Map<string, number>()
    for (const h of headingSizes) {
      if (!sizeByTag.has(h.tag)) {
        sizeByTag.set(h.tag, h.size)
      }
    }

    const sortedTags = headingTags.filter((t) => sizeByTag.has(t))
    for (let i = 0; i < sortedTags.length - 1; i++) {
      const current = sortedTags[i]
      const next = sortedTags[i + 1]
      const currentSize = sizeByTag.get(current)!
      const nextSize = sizeByTag.get(next)!

      if (currentSize <= nextSize) {
        counter++
        issues.push({
          id: `fh-${counter}`,
          ruleId: 'font-hierarchy',
          category: 'typography',
          severity: 'warning',
          message: `标题层级异常：<${current}> (${currentSize}px) 应大于 <${next}> (${nextSize}px)`,
          element: `${current} vs ${next}`,
          suggestion: `确保 ${current} 的字号 > ${next} 的字号，建议层级间至少差 4px`,
          fixCode: `${current} { font-size: ${nextSize + 8}px; }\n${next} { font-size: ${nextSize}px; }`,
        })
      }
    }

    const fontFamilies = new Set<string>()
    const allTextEls = getAllTextElements(doc)

    for (const el of allTextEls) {
      const style = getComputedStyleSafe(el)
      if (!style) continue

      const family = style.fontFamily.split(',')[0].trim().replace(/['"]/g, '')
      if (family) fontFamilies.add(family)

      const fontSize = parseFloat(style.fontSize)
      const lineHeight = parseFloat(style.lineHeight)

      if (!isNaN(lineHeight) && fontSize > 0) {
        const ratio = lineHeight / fontSize
        if (ratio < 1.2) {
          counter++
          issues.push({
            id: `fh-${counter}`,
            ruleId: 'font-hierarchy',
            category: 'typography',
            severity: 'warning',
            message: `行高过小：行高/字号 = ${ratio.toFixed(2)}，建议 ≥ 1.4`,
            element: elementSelector(el),
            suggestion: '将行高设置为字号的 1.4–1.8 倍以提升可读性',
            fixCode: `${elementSelector(el)} {\n  line-height: ${(fontSize * 1.5).toFixed(0)}px;\n}`,
          })
        }
      }

      if (fontSize > 0 && fontSize < 12) {
        counter++
        issues.push({
          id: `fh-${counter}`,
          ruleId: 'font-hierarchy',
          category: 'typography',
          severity: 'error',
          message: `字号过小：${fontSize}px，最低建议 12px`,
          element: elementSelector(el),
          suggestion: '将正文字号设为至少 14px–16px 以确保可读性',
          fixCode: `${elementSelector(el)} {\n  font-size: 14px;\n}`,
        })
      }
    }

    if (fontFamilies.size > 3) {
      counter++
      issues.push({
        id: `fh-${counter}`,
        ruleId: 'font-hierarchy',
        category: 'typography',
        severity: 'info',
        message: `使用了 ${fontFamilies.size} 种字体，建议不超过 3 种`,
        suggestion: '统一字体以保持视觉一致性，建议使用 1–2 种主字体 + 1 种代码字体',
        details: { fonts: Array.from(fontFamilies) },
      })
    }

    return issues
  },
}
