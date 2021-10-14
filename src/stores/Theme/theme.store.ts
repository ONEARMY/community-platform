import { action, makeAutoObservable } from 'mobx'
import preciousPlasticTheme from 'src/themes/precious-plastic'
import type { PlatformTheme } from 'src/themes/types'

const themeMap = {
  'precious-plastic': preciousPlasticTheme,
}

export class ThemeStore {
  currentTheme: PlatformTheme = preciousPlasticTheme

  themeOptions = [
    {
      value: 'precious-plastic',
      label: 'Precious Plastic',
    },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setActiveTheme(themeId: string) {
    if (themeMap[themeId]) {
      this.currentTheme = themeMap[themeId]
    }
  }
}
