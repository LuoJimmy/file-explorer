import { InjectionKey, Ref } from 'vue'

export interface MenuContext {
  activeValue: Ref<string | number>
  handleSelect: (value: string | number) => void
}

export const MenuKey: InjectionKey<MenuContext> = Symbol('Menu') 