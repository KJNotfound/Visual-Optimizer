import type { Issue, RuleCategory } from '@/types'

export interface Rule {
  id: string
  name: string
  category: RuleCategory
  description: string
  analyze: (doc: Document) => Issue[]
}
