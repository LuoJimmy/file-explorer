import type { ComputedRef, InjectionKey } from 'vue'

export interface TabItem {
  label: string
  value: string | number
  icon?: any
  disabled?: boolean
  closable?: boolean
}

export interface TabsContext {
  activeTab: ComputedRef<string | number>
  registerTab: (tab: TabItem) => void
}

export const TabsKey: InjectionKey<TabsContext> = Symbol('Tabs') 