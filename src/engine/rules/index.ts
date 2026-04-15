import type { Rule } from './types'
import { colorContrastRule } from './color-contrast'
import { fontHierarchyRule } from './font-hierarchy'
import { spacingConsistencyRule } from './spacing-consistency'
import { accessibilityRule } from './accessibility'

export const rules: Rule[] = [
  colorContrastRule,
  fontHierarchyRule,
  spacingConsistencyRule,
  accessibilityRule,
]

export type { Rule } from './types'
