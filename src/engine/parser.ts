import type { ParsedPage } from '@/types'

export function parseInput(html: string, css: string): ParsedPage {
  const iframe = document.createElement('iframe')
  iframe.style.position = 'absolute'
  iframe.style.left = '-9999px'
  iframe.style.top = '-9999px'
  iframe.style.width = '1280px'
  iframe.style.height = '800px'
  iframe.setAttribute('sandbox', 'allow-same-origin')
  document.body.appendChild(iframe)

  const iframeDoc = iframe.contentDocument!
  iframeDoc.open()
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head><style>${css}</style></head>
    <body>${html}</body>
    </html>
  `)
  iframeDoc.close()

  return { iframe, doc: iframeDoc }
}

export function cleanup(page: ParsedPage) {
  if (page.iframe.parentNode) {
    page.iframe.parentNode.removeChild(page.iframe)
  }
}

export function getAllTextElements(doc: Document): Element[] {
  const textTags = [
    'p', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'li', 'td', 'th', 'label', 'button', 'strong', 'em',
    'blockquote', 'figcaption', 'summary', 'dt', 'dd',
  ]
  const selector = textTags.join(',')
  return Array.from(doc.querySelectorAll(selector))
}

export function getAllElements(doc: Document): Element[] {
  return Array.from(doc.querySelectorAll('*'))
}

export function getComputedStyleSafe(el: Element): CSSStyleDeclaration | null {
  try {
    const win = el.ownerDocument.defaultView
    if (!win) return null
    return win.getComputedStyle(el)
  } catch {
    return null
  }
}
