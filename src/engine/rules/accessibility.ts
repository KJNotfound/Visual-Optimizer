import type { Rule } from './types'
import type { Issue } from '@/types'
import { getComputedStyleSafe } from '@/engine/parser'

function elementSelector(el: Element): string {
  const tag = el.tagName.toLowerCase()
  const id = el.id ? `#${el.id}` : ''
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
    : ''
  return `${tag}${id}${cls}`
}

const VAGUE_LINK_TEXTS = new Set([
  '点击这里', '这里', '更多', '详情', '链接', 'click here', 'here',
  'more', 'read more', 'link', 'learn more', '查看更多', '了解更多',
])

export const accessibilityRule: Rule = {
  id: 'accessibility',
  name: '可访问性',
  category: 'accessibility',
  description: '检查图片 alt、链接文本、表单 label、触摸目标尺寸等基础可访问性',

  analyze(doc: Document): Issue[] {
    const issues: Issue[] = []
    let counter = 0

    const images = doc.querySelectorAll('img')
    for (const img of images) {
      const alt = img.getAttribute('alt')
      if (alt === null) {
        counter++
        issues.push({
          id: `a11y-${counter}`,
          ruleId: 'accessibility',
          category: 'accessibility',
          severity: 'error',
          message: '图片缺少 alt 属性',
          element: elementSelector(img),
          suggestion: '为图片添加描述性 alt 属性，若为装饰图片使用 alt=""',
          fixCode: `<img src="${img.getAttribute('src') || '...'}" alt="描述图片内容" />`,
        })
      }
    }

    const links = doc.querySelectorAll('a')
    for (const link of links) {
      const text = link.textContent?.trim().toLowerCase() || ''
      if (text && VAGUE_LINK_TEXTS.has(text)) {
        counter++
        issues.push({
          id: `a11y-${counter}`,
          ruleId: 'accessibility',
          category: 'accessibility',
          severity: 'warning',
          message: `链接文本"${link.textContent?.trim()}"含义不明确`,
          element: elementSelector(link),
          suggestion: '使用描述性链接文本，让用户在不看上下文时也能理解链接目的',
        })
      }
      if (!text && !link.querySelector('img') && !link.getAttribute('aria-label')) {
        counter++
        issues.push({
          id: `a11y-${counter}`,
          ruleId: 'accessibility',
          category: 'accessibility',
          severity: 'error',
          message: '空链接：无文本且无 aria-label',
          element: elementSelector(link),
          suggestion: '添加可见文本或 aria-label 属性',
        })
      }
    }

    const inputs = doc.querySelectorAll('input, select, textarea')
    for (const input of inputs) {
      const type = input.getAttribute('type')
      if (type === 'hidden' || type === 'submit' || type === 'button') continue

      const id = input.getAttribute('id')
      const hasLabel = id ? doc.querySelector(`label[for="${id}"]`) : null
      const wrappedInLabel = input.closest('label')
      const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')

      if (!hasLabel && !wrappedInLabel && !hasAriaLabel) {
        counter++
        issues.push({
          id: `a11y-${counter}`,
          ruleId: 'accessibility',
          category: 'accessibility',
          severity: 'error',
          message: '表单控件缺少关联的 label',
          element: elementSelector(input),
          suggestion: '使用 <label for="..."> 或将控件包裹在 <label> 中，或添加 aria-label',
        })
      }
    }

    const clickables = doc.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"]')
    for (const el of clickables) {
      const style = getComputedStyleSafe(el)
      if (!style) continue

      const width = parseFloat(style.width)
      const height = parseFloat(style.height)

      if ((!isNaN(width) && width > 0 && width < 44) || (!isNaN(height) && height > 0 && height < 44)) {
        counter++
        issues.push({
          id: `a11y-${counter}`,
          ruleId: 'accessibility',
          category: 'accessibility',
          severity: 'warning',
          message: `触摸目标过小：${Math.round(width)}×${Math.round(height)}px，建议 ≥ 44×44px`,
          element: elementSelector(el),
          suggestion: '增大可点击区域至少 44×44px 以便移动端操作',
          fixCode: `${elementSelector(el)} {\n  min-width: 44px;\n  min-height: 44px;\n}`,
        })
      }
    }

    return issues
  },
}
