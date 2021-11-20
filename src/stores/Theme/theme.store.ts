import { action, makeAutoObservable } from 'mobx'
import preciousPlasticTheme from 'src/themes/precious-plastic'
import fixingFashionTheme from 'src/themes/fixing-fashion'
import projectKampTheme from 'src/themes/project-kamp'
import unbrandedTheme from 'src/themes/unbranded'
import type { PlatformTheme } from 'src/themes/types'

const themeMap = {
  'precious-plastic': preciousPlasticTheme,
  'project-kamp': projectKampTheme,
  'fixing-fashion': fixingFashionTheme,
  unbranded: unbrandedTheme,
}

export class ThemeStore {
  currentTheme: PlatformTheme = preciousPlasticTheme

  themeOptions = [
    {
      value: 'precious-plastic',
      label: 'Precious Plastic',
    },
    {
      value: 'project-kamp',
      label: 'Project Kamp',
    },
    {
      value: 'fixing-fashion',
      label: 'Fixing Fashion',
    },
    {
      value: 'unbranded',
      label: 'Unbranded',
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
