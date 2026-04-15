import { create } from 'zustand'
import type { AnalysisReport, AnalysisStatus, RuleCategory } from '@/types'
import { analyzeCode } from '@/engine/analyzer'

interface AnalysisState {
  htmlInput: string
  cssInput: string
  status: AnalysisStatus
  report: AnalysisReport | null
  activeTab: RuleCategory
  errorMessage: string | null

  setHtmlInput: (val: string) => void
  setCssInput: (val: string) => void
  setActiveTab: (tab: RuleCategory) => void
  runAnalysis: () => Promise<void>
  reset: () => void
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  htmlInput: '',
  cssInput: '',
  status: 'idle',
  report: null,
  activeTab: 'color',
  errorMessage: null,

  setHtmlInput: (val) => set({ htmlInput: val }),
  setCssInput: (val) => set({ cssInput: val }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  runAnalysis: async () => {
    const { htmlInput, cssInput } = get()
    if (!htmlInput.trim()) {
      set({ errorMessage: '请输入 HTML 代码' })
      return
    }

    set({ status: 'analyzing', errorMessage: null })

    try {
      const report = await analyzeCode(htmlInput, cssInput)
      set({ status: 'done', report })
    } catch (err) {
      set({
        status: 'error',
        errorMessage: err instanceof Error ? err.message : '分析过程出错',
      })
    }
  },

  reset: () =>
    set({
      htmlInput: '',
      cssInput: '',
      status: 'idle',
      report: null,
      activeTab: 'color',
      errorMessage: null,
    }),
}))
